import { 
  Detail, 
  Action, 
  ActionPanel, 
  Form, 
  showToast, 
  Toast, 
  useNavigation 
} from "@raycast/api";
import { useState, useEffect } from "react";
import { readdir, readFile, writeFile, unlink } from "fs/promises";
import { join } from "path";

interface WendyRequest {
  request_id: string;
  question: string;
  options?: string[];
  request_type: string;
}

interface WendyResponse {
  request_id: string;
  response: string;
  response_method: string;
  responded_at: string;
}

const QUEUE_DIR = "/Users/rk/gh/randykerber/syndicate/data/human_queue";
const REQUESTS_DIR = join(QUEUE_DIR, "requests");
const RESPONSES_DIR = join(QUEUE_DIR, "responses");

export default function WendyChat() {
  const [pendingRequests, setPendingRequests] = useState<WendyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentRequest, setCurrentRequest] = useState<WendyRequest | null>(null);
  const { push, pop } = useNavigation();

  // Load pending requests
  const loadRequests = async () => {
    try {
      const files = await readdir(REQUESTS_DIR);
      const jsonFiles = files.filter(f => f.endsWith('.json'));
      
      const requests: WendyRequest[] = [];
      for (const file of jsonFiles) {
        try {
          const content = await readFile(join(REQUESTS_DIR, file), 'utf8');
          const request = JSON.parse(content);
          requests.push(request);
        } catch (error) {
          console.error(`Error reading ${file}:`, error);
        }
      }
      
      setPendingRequests(requests);
      setLoading(false);
    } catch (error) {
      console.error('Error loading requests:', error);
      showToast(Toast.Style.Failure, "Error", "Failed to load Wendy's requests");
      setLoading(false);
    }
  };

  // Send response back to Wendy
  const sendResponse = async (request: WendyRequest, response: string) => {
    try {
      const responseData: WendyResponse = {
        request_id: request.request_id,
        response: response,
        response_method: 'raycast',
        responded_at: new Date().toISOString()
      };

      // Write response file
      const responseFile = join(RESPONSES_DIR, `${request.request_id}_response.json`);
      await writeFile(responseFile, JSON.stringify(responseData, null, 2));

      // Remove request file
      const requestFile = join(REQUESTS_DIR, `${request.request_id}.json`);
      await unlink(requestFile);

      showToast(Toast.Style.Success, "Response Sent", `Told Wendy: "${response}"`);
      
      // Refresh requests
      await loadRequests();
      
      // Go back to main list
      pop();
    } catch (error) {
      console.error('Error sending response:', error);
      showToast(Toast.Style.Failure, "Error", "Failed to send response to Wendy");
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  if (loading) {
    return <Detail isLoading={true} markdown="🤖 Loading Wendy's messages..." />;
  }

  if (pendingRequests.length === 0) {
    return (
      <Detail 
        markdown="✅ **No messages from Wendy**

Start Wendy first, then she'll send questions here when she needs clarification.

Run: `uv run python wendy_real_agent.py` in your Syndicate project."
        actions={
          <ActionPanel>
            <Action
              title="Refresh"
              onAction={loadRequests}
            />
          </ActionPanel>
        }
      />
    );
  }

  // Main list view
  return (
    <Detail
      markdown={`# 🌤️ Messages from Wendy

${pendingRequests.map((req, i) => `
## ${i + 1}. ${req.question}

**Type:** ${req.request_type}  
**Request ID:** ${req.request_id}

${req.options ? `**Options:**\n${req.options.map((opt, j) => `${j + 1}. ${opt}`).join('\n')}` : ''}

---
`).join('')}

**${pendingRequests.length} message(s) waiting for your response.**`}
      actions={
        <ActionPanel>
          <Action
            title="Respond to First Message"
            onAction={() => {
              setCurrentRequest(pendingRequests[0]);
              push(<ResponseForm request={pendingRequests[0]} onSendResponse={sendResponse} />);
            }}
          />
          <Action
            title="Refresh"
            onAction={loadRequests}
          />
        </ActionPanel>
      }
    />
  );
}

// Response form component
function ResponseForm({ 
  request, 
  onSendResponse 
}: { 
  request: WendyRequest; 
  onSendResponse: (req: WendyRequest, response: string) => Promise<void>;
}) {
  const [response, setResponse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!response.trim()) {
      showToast(Toast.Style.Failure, "Error", "Please enter a response");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSendResponse(request, response.trim());
    } finally {
      setIsSubmitting(false);
    }
  };

  // If it's a choice question, show buttons for options
  if (request.options && request.options.length > 0) {
    return (
      <Detail
        markdown={`# 🤖 Wendy asks:

## ${request.question}

**Choose one of the options below, or type a custom response.**

${request.options.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}`}
        actions={
          <ActionPanel>
            {request.options!.map((option, i) => (
              <Action
                key={i}
                title={`${i + 1}. ${option}`}
                onAction={() => onSendResponse(request, option)}
              />
            ))}
            <Action
              title="Custom Response..."
              onAction={() => {
                // Navigate to text form
              }}
            />
          </ActionPanel>
        }
      />
    );
  }

  // Text input form
  return (
    <Form
      isLoading={isSubmitting}
      actions={
        <ActionPanel>
          <Action
            title="Send Response"
            onAction={handleSubmit}
          />
        </ActionPanel>
      }
    >
      <Form.Description
        title="Wendy asks:"
        text={request.question}
      />
      <Form.TextArea
        id="response"
        title="Your Response"
        placeholder="Type your response to Wendy..."
        value={response}
        onChange={setResponse}
      />
    </Form>
  );
}
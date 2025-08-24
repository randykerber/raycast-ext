import { Detail, LaunchProps, showToast, Toast } from "@raycast/api";
import { useEffect, useState } from "react";
import { callAI, getSelectedText } from "./utils/ai";

export default function ExplainSelection(props: LaunchProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [explanation, setExplanation] = useState("");
  const [selectedText, setSelectedText] = useState("");

  useEffect(() => {
    async function explainSelection() {
      try {
        const text = await getSelectedText();
        
        if (!text.trim()) {
          await showToast({
            style: Toast.Style.Failure,
            title: "No text selected",
            message: "Please select some text first",
          });
          setIsLoading(false);
          return;
        }

        setSelectedText(text);
        
        const prompt = `Please explain the following text in simple terms:

${text}

Please provide:
1. A clear, concise explanation
2. Key concepts or terms defined
3. Context or background if relevant
4. Any important implications or takeaways`;

        const result = await callAI(prompt);
        setExplanation(result);
      } catch (error) {
        console.error("Error explaining selection:", error);
        setExplanation("Failed to explain the selected text. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    explainSelection();
  }, []);

  return (
    <Detail
      isLoading={isLoading}
      markdown={isLoading ? "🤔 Analyzing selection..." : `## Selected Text\n\n\`\`\`\n${selectedText}\n\`\`\`\n\n## Explanation\n\n${explanation}`}
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label title="AI Provider" text="Claude/Gemini" />
          <Detail.Metadata.Label title="Characters" text={selectedText.length.toString()} />
          <Detail.Metadata.Separator />
          <Detail.Metadata.Label title="Status" text={isLoading ? "Processing..." : "Complete"} />
        </Detail.Metadata>
      }
    />
  );
}

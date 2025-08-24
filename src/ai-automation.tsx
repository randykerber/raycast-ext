import { Detail, LaunchProps, showToast, Toast, Action, ActionPanel } from "@raycast/api";
import { useEffect, useState } from "react";
import { callAI, getSelectedText } from "./utils/ai";

interface AutomationAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  prompt: string;
}

const automationActions: AutomationAction[] = [
  {
    id: "review",
    title: "Code Review",
    description: "Perform thorough code review",
    icon: "🔍",
    prompt: `Please perform a thorough code review of the following code. Focus on:
- Code quality and best practices
- Potential bugs or issues
- Performance considerations
- Security vulnerabilities
- Maintainability concerns

Code to review:
\`\`\`
{{selection}}
\`\`\``
  },
  {
    id: "refactor",
    title: "Refactor Code",
    description: "Improve code structure and quality",
    icon: "🔧",
    prompt: `Please refactor the following code to improve:
- Readability and maintainability
- Performance
- Follow best practices
- Reduce complexity
- Add appropriate comments

Original code:
\`\`\`
{{selection}}
\`\`\`

Please provide the refactored version with explanations of the changes made.`
  },
  {
    id: "docs",
    title: "Generate Documentation",
    description: "Create comprehensive documentation",
    icon: "📚",
    prompt: `Please generate comprehensive documentation for the following code:
- Function/method descriptions
- Parameter explanations
- Return value descriptions
- Usage examples
- Any important notes or warnings

Code to document:
\`\`\`
{{selection}}
\`\`\``
  },
  {
    id: "security",
    title: "Security Analysis",
    description: "Analyze code for security issues",
    icon: "🔒",
    prompt: `Please perform a security analysis of the following code. Look for:
- Input validation issues
- SQL injection vulnerabilities
- XSS vulnerabilities
- Authentication/authorization issues
- Data exposure risks
- Other security best practices

Code to analyze:
\`\`\`
{{selection}}
\`\`\``
  }
];

export default function AIAutomation(props: LaunchProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");
  const [selectedCode, setSelectedCode] = useState("");
  const [currentAction, setCurrentAction] = useState<AutomationAction | null>(null);

  useEffect(() => {
    async function getSelection() {
      try {
        const code = await getSelectedText();
        setSelectedCode(code);
      } catch (error) {
        console.error("Error getting selection:", error);
      }
    }

    getSelection();
  }, []);

  const executeAction = async (action: AutomationAction) => {
    if (!selectedCode.trim()) {
      await showToast({
        style: Toast.Style.Failure,
        title: "No code selected",
        message: "Please select some code first",
      });
      return;
    }

    setIsLoading(true);
    setCurrentAction(action);
    setResult("");

    try {
      const prompt = action.prompt.replace("{{selection}}", selectedCode);
      const response = await callAI(prompt);
      setResult(response);
    } catch (error) {
      console.error(`Error executing ${action.title}:`, error);
      setResult(`Failed to execute ${action.title}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const getMarkdown = () => {
    if (!currentAction) {
      return `## AI Code Automation

Select an action to perform on your selected code:

${automationActions.map(action => `${action.icon} **${action.title}**: ${action.description}`).join('\n')}

### Selected Code (${selectedCode.length} characters)

\`\`\`
${selectedCode.substring(0, 200)}${selectedCode.length > 200 ? '...' : ''}
\`\`\``;
    }

    if (isLoading) {
      return `${currentAction.icon} ${currentAction.title} in progress...`;
    }

    return `## ${currentAction.icon} ${currentAction.title}

### Selected Code

\`\`\`
${selectedCode}
\`\`\`

### Result

${result}`;
  };

  return (
    <Detail
      isLoading={isLoading}
      markdown={getMarkdown()}
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label title="AI Provider" text="Claude/Gemini" />
          <Detail.Metadata.Label title="Code Length" text={selectedCode.length.toString()} />
          <Detail.Metadata.Separator />
          <Detail.Metadata.Label title="Current Action" text={currentAction?.title || "None"} />
          <Detail.Metadata.Label title="Status" text={isLoading ? "Processing..." : "Ready"} />
        </Detail.Metadata>
      }
      actions={
        <ActionPanel>
          {automationActions.map((action) => (
            <Action
              key={action.id}
              title={action.title}
              icon={action.icon}
              onAction={() => executeAction(action)}
            />
          ))}
        </ActionPanel>
      }
    />
  );
}

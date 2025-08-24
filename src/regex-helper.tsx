import { Detail, LaunchProps, showToast, Toast } from "@raycast/api";
import { useEffect, useState } from "react";
import { callAI, getSelectedText } from "./utils/ai";

export default function RegexHelper(props: LaunchProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [regexHelp, setRegexHelp] = useState("");
  const [selectedText, setSelectedText] = useState("");

  useEffect(() => {
    async function generateRegexHelp() {
      try {
        const text = await getSelectedText();
        
        if (!text.trim()) {
          await showToast({
            style: Toast.Style.Failure,
            title: "No text selected",
            message: "Please select some text describing what you want to match",
          });
          setIsLoading(false);
          return;
        }

        setSelectedText(text);
        
        const prompt = `Please help me create a regex pattern for the following requirement:

${text}

Please provide:
1. The regex pattern
2. A clear explanation of what it matches
3. Examples of strings it would match
4. Examples of strings it would NOT match
5. Any flags or modifiers that might be useful
6. Alternative patterns if applicable`;

        const result = await callAI(prompt, "gemini"); // Prefer Gemini for regex
        setRegexHelp(result);
      } catch (error) {
        console.error("Error generating regex help:", error);
        setRegexHelp("Failed to generate regex help. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    generateRegexHelp();
  }, []);

  return (
    <Detail
      isLoading={isLoading}
      markdown={isLoading ? "🔍 Generating regex pattern..." : `## Requirement\n\n${selectedText}\n\n## Regex Help\n\n${regexHelp}`}
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label title="AI Provider" text="Gemini/Claude" />
          <Detail.Metadata.Label title="Characters" text={selectedText.length.toString()} />
          <Detail.Metadata.Separator />
          <Detail.Metadata.Label title="Status" text={isLoading ? "Processing..." : "Complete"} />
        </Detail.Metadata>
      }
    />
  );
}

import { Detail, LaunchProps, showToast, Toast } from "@raycast/api";
import { useEffect, useState } from "react";
import { callAI, getSelectedText } from "./utils/ai";

export default function GenerateUnitTest(props: LaunchProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [unitTest, setUnitTest] = useState("");
  const [selectedCode, setSelectedCode] = useState("");

  useEffect(() => {
    async function generateTest() {
      try {
        const code = await getSelectedText();
        
        if (!code.trim()) {
          await showToast({
            style: Toast.Style.Failure,
            title: "No code selected",
            message: "Please select some code first",
          });
          setIsLoading(false);
          return;
        }

        setSelectedCode(code);
        
        const prompt = `Generate comprehensive unit tests for the following code. Include edge cases and error handling:

\`\`\`
${code}
\`\`\`

Please provide the test code with appropriate imports and structure.`;

        const result = await callAI(prompt);
        setUnitTest(result);
      } catch (error) {
        console.error("Error generating unit test:", error);
        setUnitTest("Failed to generate unit test. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    generateTest();
  }, []);

  return (
    <Detail
      isLoading={isLoading}
      markdown={isLoading ? "🧪 Generating unit test..." : `## Selected Code\n\n\`\`\`\n${selectedCode}\n\`\`\`\n\n## Generated Unit Test\n\n${unitTest}`}
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label title="AI Provider" text="Claude/Gemini" />
          <Detail.Metadata.Label title="Characters" text={selectedCode.length.toString()} />
          <Detail.Metadata.Separator />
          <Detail.Metadata.Label title="Status" text={isLoading ? "Processing..." : "Complete"} />
        </Detail.Metadata>
      }
    />
  );
}

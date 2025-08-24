import { execSync } from "child_process";
import { showToast, Toast, Clipboard } from "@raycast/api";
import { writeFileSync, unlinkSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

export interface AIProvider {
  name: string;
  command: string;
  available: boolean;
}

export async function getAvailableAIProviders(): Promise<AIProvider[]> {
  const providers: AIProvider[] = [
    { name: "Claude", command: "claude", available: false },
    { name: "Gemini", command: "gemini", available: false },
  ];

  for (const provider of providers) {
    try {
      execSync(`which ${provider.command}`, { stdio: "ignore" });
      provider.available = true;
    } catch {
      provider.available = false;
    }
  }

  return providers;
}

export async function callAI(prompt: string, preferredProvider?: string): Promise<string> {
  const providers = await getAvailableAIProviders();
  const availableProviders = providers.filter(p => p.available);

  if (availableProviders.length === 0) {
    await showToast({
      style: Toast.Style.Failure,
      title: "No AI CLI found",
      message: "Please install Claude or Gemini CLI first",
    });
    throw new Error("No AI CLI available");
  }

  // Choose provider based on preference or availability
  let selectedProvider = availableProviders[0];
  if (preferredProvider) {
    const preferred = availableProviders.find(p => p.name.toLowerCase() === preferredProvider.toLowerCase());
    if (preferred) {
      selectedProvider = preferred;
    }
  }

  // Create temporary file for the prompt
  const tempFile = join(tmpdir(), `raycast-ai-${Date.now()}.txt`);
  writeFileSync(tempFile, prompt);

  try {
    const result = execSync(`${selectedProvider.command} --file "${tempFile}"`, {
      encoding: "utf8",
      maxBuffer: 1024 * 1024, // 1MB buffer
    });

    return result.trim();
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "AI call failed",
      message: error instanceof Error ? error.message : "Unknown error",
    });
    throw error;
  } finally {
    // Clean up temp file
    try {
      unlinkSync(tempFile);
    } catch {
      // Ignore cleanup errors
    }
  }
}

export async function getSelectedText(): Promise<string> {
  try {
    const clipboardText = await Clipboard.readText();
    return clipboardText || "";
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Failed to get selection",
      message: "Could not read from clipboard",
    });
    throw error;
  }
}

export function createPrompt(template: string, selectedText: string): string {
  return template.replace("{{selection}}", selectedText);
}

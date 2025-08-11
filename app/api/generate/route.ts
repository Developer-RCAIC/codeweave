import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import { NextRequest, NextResponse } from "next/server";

const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.inference.ai.azure.com";

export async function POST(request: NextRequest) {
  try {
    if (!token) {
      return NextResponse.json(
        { error: "GitHub token not configured" },
        { status: 500 }
      );
    }

    const { prompt, systemMessage = "You are a coding assistant that generates complete, working code based on user requirements. Always provide full file contents with proper structure and comments.", model: requestModel = "gpt-4o" } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const client = ModelClient(endpoint, new AzureKeyCredential(token));

    const response = await client.path("/chat/completions").post({
      body: {
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        top_p: 1.0,
        max_tokens: 4000,
        model: requestModel
      }
    });

    if (isUnexpected(response)) {
      console.error("GitHub Models API error:", response.body.error);
      return NextResponse.json(
        { error: "Failed to generate code" },
        { status: 500 }
      );
    }

    const generatedContent = response.body.choices[0].message.content;

    return NextResponse.json({
      content: generatedContent,
      model: requestModel,
      usage: response.body.usage
    });

  } catch (error) {
    console.error("Error in generate API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

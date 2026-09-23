import { GoogleGenAI } from "@google/genai";
import { env } from "../../config/env";
import { SCHEMA_DESIGN_PROMPT } from "../prompts/schemadesign_prompt";
import { schemaDesignSchema } from "../schemas/schemadesign_schema";

const client = new GoogleGenAI({
    apiKey: env.geminiApiKey
});

export async function generateWithGemini(
    input: unknown
): Promise<unknown> {
    const response = await client.models.generateContent({
        model: env.geminiModel,
        contents: JSON.stringify(input),
        config: {
            systemInstruction: SCHEMA_DESIGN_PROMPT,
            responseMimeType: "application/json",
            responseSchema: schemaDesignSchema
        }
    });
    if (!response.text) {
        throw new Error(
            "Gemini returned an empty response"
        );
    }
    return JSON.parse(response.text);
}
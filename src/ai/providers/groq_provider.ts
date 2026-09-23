import Groq from "groq-sdk";
import { env } from "../../config/env";
import { SCHEMA_DESIGN_PROMPT } from "../prompts/schemadesign_prompt";
import { schemaDesignSchema } from "../schemas/schemadesign_schema";

const client = new Groq({
    apiKey: env.groqApiKey
});

export async function generateWithGroq(
    input: unknown
): Promise<unknown> {

    const response =
        await client.chat.completions.create({

            model: env.groqModel,

            messages: [
                {
                    role: "system",
                    content: SCHEMA_DESIGN_PROMPT
                },
                {
                    role: "user",
                    content: JSON.stringify(input)
                }
            ],

            response_format: {
                type: "json_schema",

                json_schema: {
                    name: "schema_design",
                    strict: true,
                    schema: schemaDesignSchema
                }
            }
        });

    const content =
        response.choices[0]?.message?.content;

    if (!content) {
        throw new Error(
            "Groq returned an empty response"
        );
    }

    return JSON.parse(content);
}
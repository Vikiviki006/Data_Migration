import "./config/env";

import schemaInput from "./test/schema_input.json";
import userQuery from "./test/user_query.json";

import {
    generateSchemaDesign
} from "./ai/ai_serivce";

import {
    SchemaDesignResponse
} from "./ai/schemas/schemadesign_zod";

export type AIInput = {
    selected_schema: typeof schemaInput;
    user_query: string;
};

async function main(): Promise<void> {

    console.log("");
    console.log("==============================");
    console.log("DATABASE SCHEMA AI TEST");
    console.log("==============================");

    const aiInput: AIInput = {
        selected_schema: schemaInput,

        user_query: userQuery.user_query
    };

    console.log("");
    console.log("Selected Tables:");

    for (
        const table
        of aiInput.selected_schema.tables
    ) {
        console.log(
            `- ${table.tableName}`
        );
    }

    console.log("");
    console.log("User Query:");

    console.log(
        aiInput.user_query
    );

    console.log("");
    console.log("Sending request...");

    try {

        const response =
            await generateSchemaDesign(
                aiInput
            );

        console.log("");
        console.log(
            `Provider: ${response.provider}`
        );

        /*
         * Validate the returned AI JSON
         * using Zod.
         */
        const validation =
            SchemaDesignResponse.safeParse(
                response.result
            );

        if (!validation.success) {

            console.error("");

            console.error(
                "❌ Response validation failed"
            );

            console.error(
                validation.error.issues
            );

            process.exit(1);
        }

        console.log("");

        console.log(
            "✅ Strict JSON validated"
        );

        console.log("");

        console.log(
            JSON.stringify(
                validation.data,
                null,
                2
            )
        );

    } catch (error) {

        console.error("");

        console.error(
            "❌ AI request failed"
        );

        console.error(error);

        process.exit(1);
    }
}


main().catch((error: unknown) => {

    console.error("");

    console.error(
        "❌ Application failed"
    );

    console.error(error);

    process.exit(1);
});
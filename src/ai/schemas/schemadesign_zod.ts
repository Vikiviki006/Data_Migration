import { z } from "zod";

export const SchemaDesignResponse = z.object({

    status: z.enum([
        "recommended",
        "needs_change",
        "not_recommended"
    ]),

    summary: z.string(),

    reasons: z.array(
        z.string()
    ),

    operations: z.array(
        z.object({
            type: z.enum([
                "CREATE_TABLE",
                "MOVE_COLUMN",
                "RENAME_COLUMN",
                "REMOVE_COLUMN",
                "CHANGE_TYPE"
            ]),

            source_table:
                z.string().nullable(),

            target_table:
                z.string().nullable(),

            source_columns:
                z.array(z.string())
        })
    ),

    relationships: z.array(
        z.object({
            source_table: z.string(),
            source_column: z.string(),

            target_table: z.string(),
            target_column: z.string(),

            cardinality: z.enum([
                "one_to_one",
                "one_to_many",
                "many_to_one"
            ])
        })
    ),

    human_review: z.object({
        required: z.boolean(),

        state: z.literal(
            "WAITING_FOR_APPROVAL"
        )
    })
});

export type SchemaDesignResponse =
    z.infer<typeof SchemaDesignResponse>;
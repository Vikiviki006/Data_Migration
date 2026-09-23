import { z } from "zod";

const ColumnSchema = z.object({
    columnName: z.string(),
    dataType: z.string(),
    dataLength: z.number().int(),
    dataPrecision: z.number().int(),
    dataScale: z.number().int(),
    nullable: z.enum(["Y", "N"]),
    dataDefault: z.string(),
    columnId: z.number().int()
}).strict();

const PrimaryKeySchema = z.object({
    constraintName: z.string(),
    columns: z.array(z.string())
}).strict();

const ForeignKeySchema = z.object({
    constraintName: z.string(),
    columns: z.array(z.string()),
    referencedTable: z.string(),
    referencedColumns: z.array(z.string())
}).strict();

const TableSchema = z.union([
    z.object({
        tableName: z.string(),
        columns: z.array(ColumnSchema),
        primaryKey: PrimaryKeySchema,
        foreignKeys: z.array(ForeignKeySchema)
    }).strict(),
    // If Groq ever stringifies a table object again, this catches and
    // surfaces it clearly instead of crashing deep in .strict() parsing.
    z.string().transform((val, ctx) => {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Table entry was returned as a JSON string instead of an object — provider output was malformed."
        });
        return z.NEVER;
    })
]);

const SuggestionSchema = z.object({
    type: z.string(),
    message: z.string(),
    reason: z.string()
}).strict();

const TableNoteSchema = z.object({
    tableName: z.string(),
    status: z.enum(["unchanged", "modified", "created", "removed"]),
    sourceTables: z.array(z.string()),
    reason: z.string(),
    suggestions: z.array(SuggestionSchema)
}).strict();

const ColumnTraceabilitySchema = z.object({
    targetTable: z.string(),
    targetColumn: z.string(),
    sourceTable: z.string(),
    sourceColumn: z.string()
}).strict();

const RelationshipSchema = z.object({
    sourceTable: z.string(),
    sourceColumn: z.string(),
    targetTable: z.string(),
    targetColumn: z.string(),
    cardinality: z.enum(["one_to_one", "one_to_many", "many_to_one", "many_to_many"]),
    reason: z.string()
}).strict();

const ChangeSchema = z.object({
    type: z.enum([
        "CREATE_TABLE",
        "REMOVE_TABLE",
        "SPLIT_TABLE",
        "MERGE_TABLE",
        "MOVE_COLUMN",
        "RENAME_TABLE",
        "RENAME_COLUMN",
        "REMOVE_COLUMN",
        "ADD_COLUMN",
        "CHANGE_TYPE",
        "ALTER_COLUMN_NULLABLE",
        "CREATE_RELATIONSHIP",
        "REMOVE_RELATIONSHIP"
    ]),
    sourceTable: z.string(),
    targetTable: z.string(),
    columns: z.array(z.string())
}).strict();

export const SchemaDesignResponse = z.object({
    status: z.enum(["recommended", "needs_change", "not_recommended"]),
    summary: z.string(),
    issue_reason: z.string(),

    target_schema: z.object({
        tables: z.array(TableSchema)
    }).strict(),

    table_notes: z.array(TableNoteSchema),
    column_traceability: z.array(ColumnTraceabilitySchema),
    relationships: z.array(RelationshipSchema),
    changes: z.array(ChangeSchema),

    human_review: z.object({
        required: z.literal(true),
        state: z.literal("WAITING_FOR_APPROVAL")
    }).strict()
}).strict();

export type SchemaDesignResponse = z.infer<typeof SchemaDesignResponse>;
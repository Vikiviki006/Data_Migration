export const schemaDesignSchema = {
    type: "object",

    properties: {
        status: {
            type: "string",
            enum: ["recommended", "needs_change", "not_recommended"]
        },

        summary: { type: "string" },

        // Empty string when there is no issue (status "recommended").
        issue_reason: { type: "string" },

        target_schema: {
            type: "object",

            properties: {
                tables: {
                    type: "array",

                    items: {
                        type: "object",

                        properties: {
                            tableName: { type: "string" },

                            columns: {
                                type: "array",

                                items: {
                                    type: "object",

                                    properties: {
                                        columnName: { type: "string" },
                                        dataType: { type: "string" },
                                        // -1 means "not applicable" (no length/precision/scale for this type)
                                        dataLength: { type: "integer" },
                                        dataPrecision: { type: "integer" },
                                        dataScale: { type: "integer" },
                                        nullable: { type: "string", enum: ["Y", "N"] },
                                        // "" means no default
                                        dataDefault: { type: "string" },
                                        columnId: { type: "integer" }
                                    },

                                    required: [
                                        "columnName", "dataType", "dataLength",
                                        "dataPrecision", "dataScale", "nullable",
                                        "dataDefault", "columnId"
                                    ],

                                    additionalProperties: false
                                }
                            },

                            // Always an object. constraintName: "" and columns: [] means "no primary key".
                            primaryKey: {
                                type: "object",

                                properties: {
                                    constraintName: { type: "string" },
                                    columns: { type: "array", items: { type: "string" } }
                                },

                                required: ["constraintName", "columns"],
                                additionalProperties: false
                            },

                            foreignKeys: {
                                type: "array",

                                items: {
                                    type: "object",

                                    properties: {
                                        constraintName: { type: "string" },
                                        columns: { type: "array", items: { type: "string" } },
                                        referencedTable: { type: "string" },
                                        referencedColumns: { type: "array", items: { type: "string" } }
                                    },

                                    required: [
                                        "constraintName", "columns",
                                        "referencedTable", "referencedColumns"
                                    ],

                                    additionalProperties: false
                                }
                            }
                        },

                        required: ["tableName", "columns", "primaryKey", "foreignKeys"],
                        additionalProperties: false
                    }
                }
            },

            required: ["tables"],
            additionalProperties: false
        },

        table_notes: {
            type: "array",

            items: {
                type: "object",

                properties: {
                    tableName: { type: "string" },

                    status: {
                        type: "string",
                        enum: ["unchanged", "modified", "created", "removed"]
                    },

                    sourceTables: { type: "array", items: { type: "string" } },
                    reason: { type: "string" },

                    suggestions: {
                        type: "array",

                        items: {
                            type: "object",

                            properties: {
                                type: { type: "string" },
                                message: { type: "string" },
                                reason: { type: "string" }
                            },

                            required: ["type", "message", "reason"],
                            additionalProperties: false
                        }
                    }
                },

                required: ["tableName", "status", "sourceTables", "reason", "suggestions"],
                additionalProperties: false
            }
        },

        column_traceability: {
            type: "array",

            items: {
                type: "object",

                properties: {
                    targetTable: { type: "string" },
                    targetColumn: { type: "string" },
                    sourceTable: { type: "string" },
                    sourceColumn: { type: "string" }
                },

                required: ["targetTable", "targetColumn", "sourceTable", "sourceColumn"],
                additionalProperties: false
            }
        },

        relationships: {
            type: "array",

            items: {
                type: "object",

                properties: {
                    sourceTable: { type: "string" },
                    sourceColumn: { type: "string" },
                    targetTable: { type: "string" },
                    targetColumn: { type: "string" },

                    cardinality: {
                        type: "string",
                        enum: ["one_to_one", "one_to_many", "many_to_one", "many_to_many"]
                    },

                    reason: { type: "string" }
                },

                required: [
                    "sourceTable", "sourceColumn", "targetTable",
                    "targetColumn", "cardinality", "reason"
                ],

                additionalProperties: false
            }
        },

        changes: {
            type: "array",

            items: {
                type: "object",

                properties: {
                    type: {
                        type: "string",
                        enum: [
                            "CREATE_TABLE", "REMOVE_TABLE", "SPLIT_TABLE", "MERGE_TABLE",
                            "MOVE_COLUMN", "RENAME_TABLE", "RENAME_COLUMN", "REMOVE_COLUMN",
                            "ADD_COLUMN", "CHANGE_TYPE", "ALTER_COLUMN_NULLABLE",
                            "CREATE_RELATIONSHIP", "REMOVE_RELATIONSHIP"
                        ]
                    },

                    // "" when there is no single source table (e.g. a brand-new CREATE_TABLE).
                    sourceTable: { type: "string" },
                    targetTable: { type: "string" },
                    columns: { type: "array", items: { type: "string" } }
                },

                required: ["type", "sourceTable", "targetTable", "columns"],
                additionalProperties: false
            }
        },

        human_review: {
            type: "object",

            properties: {
                // Always true — enforced by the prompt, not by an enum (Gemini rejects enum on boolean).
                required: { type: "boolean" },
                state: { type: "string", enum: ["WAITING_FOR_APPROVAL"] }
            },

            required: ["required", "state"],
            additionalProperties: false
        }
    },

    required: [
        "status", "summary", "issue_reason", "target_schema",
        "table_notes", "column_traceability", "relationships",
        "changes", "human_review"
    ],

    additionalProperties: false
};
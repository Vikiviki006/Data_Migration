export const schemaDesignSchema = {
    type: "object",

    properties: {
        status: {
            type: "string",
            enum: [
                "recommended",
                "needs_change",
                "not_recommended"
            ]
        },

        summary: {
            type: "string"
        },

        reasons: {
            type: "array",
            items: {
                type: "string"
            }
        },

        operations: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    type: {
                        type: "string",
                        enum: [
                            "CREATE_TABLE",
                            "MOVE_COLUMN",
                            "RENAME_COLUMN",
                            "REMOVE_COLUMN",
                            "CHANGE_TYPE"
                        ]
                    },

                    source_table: {
                        type: ["string", "null"]
                    },

                    target_table: {
                        type: ["string", "null"]
                    },

                    source_columns: {
                        type: "array",
                        items: {
                            type: "string"
                        }
                    }
                },

                required: [
                    "type",
                    "source_table",
                    "target_table",
                    "source_columns"
                ],

                additionalProperties: false
            }
        },

        relationships: {
            type: "array",
            items: {
                type: "object",

                properties: {
                    source_table: {
                        type: "string"
                    },

                    source_column: {
                        type: "string"
                    },

                    target_table: {
                        type: "string"
                    },

                    target_column: {
                        type: "string"
                    },

                    cardinality: {
                        type: "string",
                        enum: [
                            "one_to_one",
                            "one_to_many",
                            "many_to_one"
                        ]
                    }
                },

                required: [
                    "source_table",
                    "source_column",
                    "target_table",
                    "target_column",
                    "cardinality"
                ],

                additionalProperties: false
            }
        },

        human_review: {
            type: "object",

            properties: {
                required: {
                    type: "boolean"
                },

                state: {
                    type: "string",
                    enum: [
                        "WAITING_FOR_APPROVAL"
                    ]
                }
            },

            required: [
                "required",
                "state"
            ],

            additionalProperties: false
        }
    },

    required: [
        "status",
        "summary",
        "reasons",
        "operations",
        "relationships",
        "human_review"
    ],

    additionalProperties: false
};
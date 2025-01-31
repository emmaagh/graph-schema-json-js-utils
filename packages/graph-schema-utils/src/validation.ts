import AjvModule from "ajv";

// FIXME: https://github.com/ajv-validator/ajv/issues/2047
const Ajv = AjvModule.default;

const ajv = new Ajv({ strict: false, allErrors: true });

export function validateSchema(
  jsonSchema: string,
  graphSchema: string
): boolean {
  if (typeof jsonSchema !== "string") {
    throw new InputTypeError("JSON schema should be a string");
  }
  let jsonSchemaObj;
  try {
    jsonSchemaObj = JSON.parse(jsonSchema);
  } catch (_) {
    throw new InputTypeError("Cannot JSON.parse JSON schema input");
  }

  if (typeof graphSchema !== "string") {
    throw new InputTypeError("Graph schema should be a string");
  }

  let graphSchemaObj;
  try {
    graphSchemaObj = JSON.parse(graphSchema);
  } catch (_) {
    throw new InputTypeError("Cannot JSON.parse graph schema input");
  }

  const validate = ajv.compile(jsonSchemaObj);
  const result = validate(graphSchemaObj);
  if (result !== true) {
    throw new SchemaValidationError(validate.errors);
  }
  return true;
}

export class SchemaValidationError extends Error {
  messages: AjvModule.ErrorObject<string, Record<string, any>, unknown>[] = [];

  constructor(
    inputMessages: AjvModule.ErrorObject<string, Record<string, any>, unknown>[]
  ) {
    super(`See error.messages for details`);
    this.messages = inputMessages;
    this.name = "SchemaValidationError";
  }
}

export class InputTypeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InputTypeError";
  }
}

export type ModelKind = "deterministic" | "local_narrative" | "unavailable";

export interface ModelRequest {
  task: "grow.report";
  input: Record<string, string | undefined>;
}

export interface ModelResponse {
  kind: ModelKind;
  text: string;
  citations: { sourceKey: string; sourceRecordId: string; url: string }[];
  fabricated: false;
}

export interface InternalModelAdapter {
  infer(req: ModelRequest): Promise<ModelResponse>;
}

export class UnavailableModelAdapter implements InternalModelAdapter {
  async infer(): Promise<ModelResponse> {
    return {
      kind: "unavailable",
      text: "",
      citations: [],
      fabricated: false,
    };
  }
}

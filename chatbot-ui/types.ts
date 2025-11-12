export interface LlmTokenEvent {
    type: 'llm_token';
    node: 'model' | 'tools';
    token: string;
}

export interface ToolCallEvent {
    type: 'tool_call';
    step: 'model';
    tool_name: string;
    tool_input: { query: string };
    tool_id: string;
}

export interface ToolOutputEvent {
    type: 'tool_output';
    step: 'tools';
    tool_name: string;
    output: string; // JSON string
    tool_call_id: string;
}

export type StreamEvent = LlmTokenEvent | ToolCallEvent | ToolOutputEvent;

export interface UserMessageData {
    id: string;
    type: 'user';
    content: string;
}

export interface AssistantMessageData {
    id: string;
    type: 'assistant';
    content: string;
    isComplete?: boolean;
}

export interface ToolOutputResult {
    content: string;
    metadata: { [key: string]: any };
}

export interface ToolStep {
    tool_call_id: string;
    tool_name: string;
    input: string;
    output: ToolOutputResult[] | null;
}

export interface ToolStepMessageData {
    id: string;
    type: 'tool_step';
    steps: ToolStep[];
    isComplete?: boolean;
}

export type Message = UserMessageData | AssistantMessageData | ToolStepMessageData;

export interface ParsedToolOutput {
    results: ToolOutputResult[];
}
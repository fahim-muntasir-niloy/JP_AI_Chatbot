
export enum Role {
  User = 'user',
  Assistant = 'assistant',
}

export interface ChatMessage {
  role: Role.User | Role.Assistant;
  content: string;
}

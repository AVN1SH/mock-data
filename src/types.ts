export interface PaperConfig {
  grade: string;
  subject: string;
}

export enum MessageRole {
  USER = 'user',
  BOT = 'bot',
  SYSTEM_FORM = 'system_form'
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  isError?: boolean;
}

export interface PaperData {
  title: string;
  content: string; // Markdown content
}

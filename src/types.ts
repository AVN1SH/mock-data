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

export enum Sender {
  BOT = 'BOT',
  USER = 'USER'
}

export interface Message {
  id: string;
  sender: Sender;
  text: string;
  options?: string[]; // Options provided by the bot for the user to select
  isTyping?: boolean; // For UI state
  timestamp: number;
}

export interface CollectedData {
  [key: string]: string;
}

export interface BotResponse {
  text: string;
  options: string[];
  key_name: string; // The key to store this data point under (e.g., "budget", "location")
  finished: boolean;
}
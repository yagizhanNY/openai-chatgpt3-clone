import { ChatCompletionRequestMessage } from 'openai';

export interface ChatHistoryDetails {
  id: string;
  title: string;
  messages: ChatCompletionRequestMessage[];
}

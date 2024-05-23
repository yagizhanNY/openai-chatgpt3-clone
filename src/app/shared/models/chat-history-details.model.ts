import { ChatCompletionMessage } from "openai/resources";

export interface ChatHistoryDetails {
  id: string;
  title: string;
  messages: ChatCompletionMessage[];
}

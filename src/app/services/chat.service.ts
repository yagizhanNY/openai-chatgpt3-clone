import { Injectable } from '@angular/core';
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatDataService } from './chat-data.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  openai!: OpenAIApi;

  messages: ChatCompletionRequestMessage[] = [];
  private messagesSubject = new BehaviorSubject<ChatCompletionRequestMessage[]>(
    []
  );

  constructor(private chatDataService: ChatDataService) {
    this.updateConfiguration();
  }

  public updateConfiguration(): void {
    const configuration = new Configuration({
      apiKey: this.chatDataService.getAPIKeyFromLocalStore() ?? '',
    });

    this.openai = new OpenAIApi(configuration);
  }

  async createCompletionViaOpenAI(messages: ChatCompletionRequestMessage[]) {
    return await this.openai.createChatCompletion(
      {
        model: 'gpt-3.5-turbo',
        messages: messages,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-User-Agent': 'OpenAPI-Generator/1.0/Javascript',
        },
      }
    );
  }

  async getTitleFromChatGpt(messages: ChatCompletionRequestMessage[]) {
    return await this.openai.createChatCompletion(
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `create a max 10 character title from below messages. ${JSON.stringify(
              messages
            )}`,
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-User-Agent': 'OpenAPI-Generator/1.0/Javascript',
        },
      }
    );
  }

  public setMessagesSubject(event: ChatCompletionRequestMessage[]) {
    this.messagesSubject.next(event);
  }

  public getMessagesSubject(): Observable<ChatCompletionRequestMessage[]> {
    return this.messagesSubject.asObservable();
  }
}

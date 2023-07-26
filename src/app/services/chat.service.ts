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
  //private eventSubjectForChatNavigation = new Subject<string>();

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
    let gptMessages: ChatCompletionRequestMessage[] = [
      {
        role: 'system',
        content: 'create a max 10 character title from below messages.',
      },
    ];

    return await this.openai.createChatCompletion(
      {
        model: 'gpt-3.5-turbo',
        messages: gptMessages.concat(messages),
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

  // public triggerEventForChatNavigation(event: string) {
  //   // const {event, uuid} = {...metaData}
  //   this.eventSubjectForChatNavigation.next(event);
  // }

  public getMessagesSubject(): Observable<ChatCompletionRequestMessage[]> {
    return this.messagesSubject.asObservable();
  }

  // public getEventForChatCreation(): Observable<Message[]> {
  //   return this.eventSubjectForChatCreation.asObservable();
  // }
}

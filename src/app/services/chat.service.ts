// type MessageWithMetaData = {
//   event: Message[];
//   uuid: string;
// };
import { Injectable } from '@angular/core';
import { Configuration, OpenAIApi } from 'openai';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Message } from '../shared/models/message.model';
import { ChatDataService } from './chat-data.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  openai!: OpenAIApi;

  private eventSubjectForChatCreation = new Subject<Message[]>();
  private eventSubjectForChatNavigation = new Subject<string>();

  constructor(private chatDataService: ChatDataService) {
    this.updateConfiguration(environment.openAiApiKey);
  }

  public updateConfiguration(apiKey: string): void {
    const configuration = new Configuration({
      apiKey: apiKey || (this.chatDataService.getAPIKeyToLocalStore() ?? ''),
    });

    this.openai = new OpenAIApi(configuration);
  }

  async createCompletionViaOpenAI(prompt: string) {
    return await this.openai.createChatCompletion(
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-User-Agent': 'OpenAPI-Generator/1.0/Javascript',
        },
      }
    );
  }

  public triggerEventForChatCreation(event: Message[]) {
    this.eventSubjectForChatCreation.next(event);
  }

  public triggerEventForChatNavigation(event: string) {
    // const {event, uuid} = {...metaData}
    this.eventSubjectForChatNavigation.next(event);
  }

  public getEventSubjectForChatNavigation(): Observable<string> {
    return this.eventSubjectForChatNavigation.asObservable();
  }

  public getEventForChatCreation(): Observable<Message[]> {
    return this.eventSubjectForChatCreation.asObservable();
  }
}

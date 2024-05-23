import { BehaviorSubject, Observable } from 'rxjs';
import { ChatCompletion, ChatCompletionMessage, ChatCompletionMessageParam } from 'openai/resources';
import OpenAI, { ClientOptions } from 'openai';

import { ChatDataService } from './chat-data.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  openai!: OpenAI;

  messages: ChatCompletionMessage[] = [];
  private messagesSubject = new BehaviorSubject<ChatCompletionMessage[]>(
    []
  );

  constructor(private chatDataService: ChatDataService) {
    this.updateConfiguration();
  }

  public updateConfiguration(): void {
    const configuration: ClientOptions = {
      apiKey: this.chatDataService.getAPIKeyFromLocalStore() ?? '',
      dangerouslyAllowBrowser: true
    };

    this.openai = new OpenAI(configuration);
  }

  async createCompletionViaOpenAI(messages: ChatCompletionMessageParam[]): Promise<ChatCompletion> {
    return new Promise((resolve, reject) => {
      this.openai.chat.completions.create(
        {
          model: 'gpt-4o',
          messages: messages,
        }
      ).then(message => {
        resolve(message);
      }).catch(err => {
        reject(err);
      })
    })
  }

  async getTitleFromChatGpt(messages: ChatCompletionMessageParam[]): Promise<ChatCompletion> {
    return new Promise((resolve, reject) => {
      this.openai.chat.completions.create(
        {
          model: 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: `create a max 10 character title from below messages. ${JSON.stringify(
                messages
              )}`,
            },
          ],
        }
      ).then(message => {
        resolve(message)
      }).catch(err => {
        reject(err);
      })
    })
  }

  public setMessagesSubject(event: ChatCompletionMessage[]) {
    this.messagesSubject.next(event);
  }

  public getMessagesSubject(): Observable<ChatCompletionMessage[]> {
    return this.messagesSubject.asObservable();
  }
}

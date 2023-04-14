import { Injectable } from '@angular/core';
import { Configuration, OpenAIApi } from 'openai';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  openai: OpenAIApi;
  constructor() {
    const configuration = new Configuration({
      organization: environment.organizationId,
      apiKey: environment.openAiApiKey,
    });

    this.openai = new OpenAIApi(configuration);
  }

  async createCompletion(prompt: string) {
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
}

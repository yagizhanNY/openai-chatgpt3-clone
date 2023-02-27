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
    return await this.openai.createCompletion(
      {
        model: 'text-davinci-003',
        prompt: prompt,
        temperature: 0,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'OpenAPI-Generator/1.0/Javascript',
        },
      }
    );
  }
}

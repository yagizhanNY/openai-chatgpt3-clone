import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { MarkdownService } from 'ngx-markdown';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiKeyService } from 'src/app/services/api-key.service';
import { ChatCompletionRequestMessage } from 'openai';

@Component({
  selector: 'app-chat-content',
  templateUrl: './chat-content.component.html',
  styleUrls: ['./chat-content.component.css'],
})
export class ChatContentComponent
  implements OnInit, AfterViewChecked, AfterViewInit
{
  constructor(
    private chatService: ChatService,
    private markdownService: MarkdownService,
    private apiKeyService: ApiKeyService,
    private snackBar: MatSnackBar
  ) {}

  @ViewChild('window') window!: any;
  public messages: ChatCompletionRequestMessage[] = [];
  apiKey: string | null = '';
  isBusy: boolean = false;
  currChatSelected: string = '';
  @ViewChild('textInput', { static: true }) textInputRef!: ElementRef;

  ngOnInit(): void {
    this.scrollToBottom();

    // Subscribe to messages
    this.chatService.getMessagesSubject().subscribe((messages) => {
      this.messages = messages;
    });

    // Subscribe to the api key.
    this.apiKeyService.getApiKey().subscribe((apiKey) => {
      this.apiKey = apiKey;
    });
  }

  ngAfterViewInit() {
    this.textInputRef.nativeElement.focus();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  async createCompletion(element: HTMLTextAreaElement) {
    const prompt = element.value;
    if (prompt.length <= 1 || this.isBusy) {
      element.value = '';
      return;
    }
    element.value = '';
    const message: ChatCompletionRequestMessage = {
      role: 'user',
      content: prompt,
    };

    this.messages.push(message);
    try {
      this.isBusy = true;
      const completion = await this.chatService.createCompletionViaOpenAI(
        this.messages
      );
      console.log(completion);
      const completionMessage = this.markdownService.parse(
        completion.data.choices[0].message?.content!
      );

      const responseMessage: ChatCompletionRequestMessage = {
        role: 'assistant',
        content: completionMessage,
      };

      this.messages.push(responseMessage);
    } catch (err) {
      this.snackBar.open(
        'API Request Failed, please check after some time or verify the OpenAI key.',
        'Close',
        {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000,
        }
      );
    }

    this.chatService.setMessagesSubject(this.messages);
    this.isBusy = false;
    this.scrollToBottom();
  }

  scrollToBottom() {
    window.scrollTo(0, document.body.scrollHeight);
  }
}

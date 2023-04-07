import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
} from '@angular/core';
import { ChatService } from '../services/chat.service';
import { Message } from '../shared/models/message.model';
import { MarkdownService } from 'ngx-markdown';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, AfterViewChecked, AfterViewInit {
  constructor(
    private chatService: ChatService,
    private markdownService: MarkdownService
  ) {}

  @ViewChild('window') window!: any;
  messages: Message[] = [];
  isBusy: boolean = false;
  @ViewChild('textInput', { static: true }) textInputRef!: ElementRef;
  sideBarOnDisplay = true;

  ngOnInit(): void {
    this.scrollToBottom();
  }

  ngAfterViewInit() {
    this.textInputRef.nativeElement.focus();
  }

  // Other component code...

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  updateSideBarOnDisplayEvent(sidebar: boolean): void {
    this.sideBarOnDisplay = sidebar;
  }

  async createCompletion(element: HTMLTextAreaElement) {
    const prompt = element.value;
    element.value = '';
    this.messages.push({
      isResponse: false,
      message: prompt,
    });

    this.scrollToBottom();

    this.isBusy = true;

    try {
      const completion = await this.chatService.createCompletion(prompt);
      this.messages.push({
        isResponse: true,
        message: this.markdownService.parse(
          completion.data.choices[0].message?.content!
        ),
      });
    } catch (err) {
      console.log(err);
    }

    this.isBusy = false;

    this.scrollToBottom();
  }

  scrollToBottom() {
    window.scrollTo(0, document.body.scrollHeight);
  }
}

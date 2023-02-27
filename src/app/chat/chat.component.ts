import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ChatService } from '../services/chat.service';
import { Message } from '../shared/models/message.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, AfterViewChecked {
  constructor(private chatService: ChatService) {}
  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  @ViewChild('window') window!: any;
  messages: Message[] = [];
  isBusy: boolean = false;
  ngOnInit(): void {
    this.scrollToBottom();
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

    const completion = await this.chatService.createCompletion(prompt);
    this.messages.push({
      isResponse: true,
      message: completion.data.choices[0].text!,
    });

    this.isBusy = false;

    this.scrollToBottom();
  }

  scrollToBottom() {
    window.scrollTo(0, document.body.scrollHeight);
  }
}

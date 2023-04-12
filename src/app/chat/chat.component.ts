import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ChatService } from '../services/chat.service';
import { Message } from '../shared/models/message.model';
import { MarkdownService } from 'ngx-markdown';
import { ChatDataService } from '../services/chat-data.service';
import { Store } from '@ngrx/store';
import { LocalStorageState } from '../shared/models/chat-data-storage.model';
import { updateChatDataAction } from '../store/actions/ChatData.action';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, AfterViewChecked, AfterViewInit {
  constructor(
    private chatService: ChatService,
    private markdownService: MarkdownService,
    private chatDataService: ChatDataService,
    private store: Store<LocalStorageState>
  ) {}

  @ViewChild('window') window!: any;
  messages: Message[] = [];
  isBusy: boolean = false;
  @ViewChild('textInput', { static: true }) textInputRef!: ElementRef;

  sideBarOnDisplay = true;

  ngOnInit(): void {
    this.scrollToBottom();
    const currMessagesFromStore = this.chatDataService.getLocalStorage('1');

    if (currMessagesFromStore) {
      this.messages = JSON.parse(currMessagesFromStore);
      this.messages.forEach((message) => {
        this.store.dispatch(updateChatDataAction({ newChatMessage: message }));
      });
    }
    console.log(this.messages);
  }

  ngAfterViewInit() {
    this.textInputRef.nativeElement.focus();
  }

  // Other component code...

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  async createCompletion(element: HTMLTextAreaElement) {
    const prompt = element.value;
    element.value = '';
    const message: Message = { isResponse: false, message: prompt };
    this.store.dispatch(updateChatDataAction({ newChatMessage: message }));
    this.store
      .select((state) => state.data)
      .subscribe((data) => {
        this.messages = data;
      });
    this.scrollToBottom();

    this.isBusy = true;

    try {
      const completion = await this.chatService.createCompletion(prompt);
      const completionMessage = this.markdownService.parse(
        completion.data.choices[0].message?.content!
      );
      // this.messages.push({
      //   isResponse: true,
      //   message: this.markdownService.parse(
      //     completion.data.choices[0].message?.content!
      //   ),
      // });

      const responseMessage: Message = {
        isResponse: true,
        message: completionMessage,
      };
      this.store.dispatch(
        updateChatDataAction({ newChatMessage: responseMessage })
      );

      this.store
        .select((state) => state.data)
        .subscribe((data) => {
          this.messages = data;
        });
      this.chatDataService.setLocalStorage('1', this.messages);
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

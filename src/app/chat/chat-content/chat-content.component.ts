import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
} from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Message } from '../../shared/models/message.model';
import { MarkdownService } from 'ngx-markdown';
import { ChatDataService } from '../../services/chat-data.service';
import { Store } from '@ngrx/store';
import { LocalStorageState } from '../../shared/models/chat-data-storage.model';
import { updateChatDataAction } from '../../store/actions/ChatData.action';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

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
    private chatDataService: ChatDataService,
    private store: Store<LocalStorageState>,
    private route: ActivatedRoute
  ) {}

  @ViewChild('window') window!: any;
  messages: Message[] = [];
  isBusy: boolean = false;
  currChatSelected: string = '';
  @ViewChild('textInput', { static: true }) textInputRef!: ElementRef;

  ngOnInit(): void {
    this.scrollToBottom();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.currChatSelected = id;
      const storedChatData = this.chatDataService.getLocalStorage(id);
      if (storedChatData) {
        this.messages = JSON.parse(storedChatData);
      }
    }
    const firstChatConversation = localStorage.key(0);
    let currMessagesFromStore = null;
    if (firstChatConversation !== null) {
      currMessagesFromStore = this.chatDataService.getLocalStorage(
        firstChatConversation
      );
    }
    if (currMessagesFromStore !== null) {
      this.messages = JSON.parse(currMessagesFromStore);
      this.messages.forEach((message) => {
        this.store.dispatch(updateChatDataAction({ newChatMessage: message }));
      });
    }
    this.chatService
      .getEventSubjectForChatNavigation()
      .subscribe((event: string) => {
        this.fetchFocusedChatConversation(event);
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
    console.log(prompt, prompt.length);
    if (prompt.length <= 1 || this.isBusy) {
      element.value = '';
      return;
    }
    element.value = '';
    const message: Message = {
      isResponse: false,
      message: prompt,
      chatName: this.currChatSelected,
    };
    this.store.dispatch(updateChatDataAction({ newChatMessage: message }));
    this.store
      .select((state) => state.data)
      .subscribe((data) => {
        this.messages = data;
      });
    this.scrollToBottom();

    try {
      this.isBusy = true;
      const completion = await this.chatService.createCompletionViaOpenAI(
        prompt
      );
      const completionMessage = this.markdownService.parse(
        completion.data.choices[0].message?.content!
      );

      const responseMessage: Message = {
        isResponse: true,
        message: completionMessage,
        chatName: this.currChatSelected,
      };
      this.store.dispatch(
        updateChatDataAction({ newChatMessage: responseMessage })
      );

      this.store
        .select((state) => state.data)
        .subscribe((data) => {
          this.messages = data;
        });
      this.chatDataService.setLocalStorageForAllChat(
        this.currChatSelected,
        this.messages
      );
      this.chatService.triggerEventForChatCreation(this.messages);
    } catch (err) {
      console.log(err);
    }

    this.isBusy = false;

    this.scrollToBottom();
  }

  scrollToBottom() {
    window.scrollTo(0, document.body.scrollHeight);
  }

  fetchFocusedChatConversation(uuid: string) {
    const currChatConversation = this.chatDataService.getLocalStorage(uuid);
    if (currChatConversation) {
      this.messages = JSON.parse(currChatConversation);
    }
  }
}

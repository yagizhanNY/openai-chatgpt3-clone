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
  public messages: Message[] = [];
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
    const firstChatConversation = this.getFirstChatConversation();
    let currMessagesFromStore = null;
    if (firstChatConversation !== null) {
      currMessagesFromStore = this.chatDataService.getLocalStorage(
        firstChatConversation
      );
    }
    if (currMessagesFromStore !== null && currMessagesFromStore !== 'apiKey') {
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

  getFirstChatConversation(): string | null {
    let firstChatConversation = null;
    for (let key in localStorage) {
      if (key !== 'apiKey') {
        firstChatConversation = key;
        return firstChatConversation;
      }
    }
    return firstChatConversation;
  }

  ngAfterViewInit() {
    this.textInputRef.nativeElement.focus();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  async createCompletion(element: HTMLTextAreaElement) {
    const id = this.route.snapshot.paramMap.get('id');
    const prompt = element.value;
    if (prompt.length <= 1 || this.isBusy) {
      element.value = '';
      return;
    }
    element.value = '';
    const message: Message = {
      isResponse: false,
      message: prompt,
      chatName:
        'Chat ' +
        JSON.stringify(this.chatDataService.getTotalChatConversation() + 1),
    };

    this.messages.push(message);
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
        chatName:
          'Chat ' +
          JSON.stringify(this.chatDataService.getTotalChatConversation() + 1),
      };

      this.messages.push(responseMessage);
      if (id && this.chatDataService.getLocalStorage(id)) {
        this.chatDataService.setLocalStorageForAllChat(id, this.messages);
      } else {
        this.chatService.triggerEventForChatCreation(this.messages);
      }
    } catch (err) {
      const responseMessage: Message = {
        isResponse: true,
        message:
          'API Request Failed, please check after some time or re-verify OpenAI key.',
        chatName:
          'Chat ' +
          JSON.stringify(this.chatDataService.getTotalChatConversation() + 1),
      };
      this.messages.push(responseMessage);
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

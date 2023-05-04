import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ChatDataService } from '../services/chat-data.service';
import { Message } from '../shared/models/message.model';
import { v4 as uuidv4 } from 'uuid';
import { ChatService } from '../services/chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  totalChatConversation: number = 1;
  defaultConversation: string = '';
  allChatData: {
    [key: string]: {
      isResponse: boolean;
      message: string | null;
      chatName: string;
    };
  } = {};
  keys: string[] = [];
  constructor(
    private chatDataService: ChatDataService,
    private chatService: ChatService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.totalChatConversation = localStorage.length;
    if (this.totalChatConversation >= 1) {
      const currKey = localStorage.key(0);
      this.defaultConversation = currKey ? currKey : '';
      // let currentChatData = null;
      // if (currKey) {
      //   currentChatData = this.chatDataService.getLocalStorage(currKey);
      // }
      // if (currentChatData)
      //   this.defaultConversation = JSON.parse(currentChatData);
    }
    for (let i = 0; i < this.totalChatConversation; i++) {
      const currentKeyString = localStorage.key(i);
      if (currentKeyString !== null) {
        let currentChat =
          this.chatDataService.getLocalStorage(currentKeyString);
        if (currentChat !== null) {
          this.allChatData[currentKeyString] = JSON.parse(currentChat);
        }
        this.keys.push(currentKeyString);
      }
    }

    this.chatService.getEventForChatCreation().subscribe((event: Message[]) => {
      if (this.totalChatConversation === 0) {
        this.addNewChat(event);
      }
    });
  }

  addNewChat(data?: Message[]) {
    this.totalChatConversation += 1;
    const newChatKey = uuidv4();
    this.keys.push(newChatKey);
    const newChatDataArray: Message[] = [];
    if (data) {
      for (let i = 0; i < data?.length; i++) {
        newChatDataArray.push(data[i]);
      }

      this.chatDataService.setLocalStorageForAllChat(
        newChatKey,
        newChatDataArray
      );
    } else {
      const newChatData: Message = {
        isResponse: false,
        message: null,
        chatName: `Chat ${this.totalChatConversation}`,
      };
      newChatDataArray.push(newChatData);
      this.allChatData[newChatKey] = { ...newChatData };
      this.chatDataService.setLocalStorageForAllChat(
        newChatKey,
        newChatDataArray
      );
    }
    this.router.navigate(['/chat', newChatKey]);
    this.chatService.triggerEventForChatNavigation(newChatKey);
  }

  getChatName(key: string) {
    // console.log(this.allChatData[key][0].chatName);
    const currChatName = this.chatDataService.getLocalStorage(key);
    return currChatName ? JSON.parse(currChatName)[0]?.chatName : '';
  }

  onChatBoxClick(uuid: string) {
    // this.chatService.getEventForChatCreation().subscribe((event: Message[]) => {
    //   if (this.totalChatConversation === 0) {
    //     this.addNewChat(event);
    //   }
    // });
    this.chatService.triggerEventForChatNavigation(uuid);
    // this.router.navigate(['/chat', uuid]);
  }
}

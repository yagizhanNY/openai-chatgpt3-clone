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
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
  MatDialogConfig,
} from '@angular/material/dialog';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  constructor(
    private chatDataService: ChatDataService,
    private chatService: ChatService,
    private router: Router,
    private dialogModel: MatDialog
  ) {}

  userDialogBox!: MatDialogRef<UserDialogComponent>;
  totalChatConversation!: number;
  defaultConversation: string = '';
  apiKey: string = '';
  allChatData: {
    [key: string]: {
      isResponse: boolean;
      message: string | null;
      chatName: string;
    };
  } = {};
  keys: string[] = [];

  ngOnInit(): void {
    this.chatDataService.setTotalChatConversation(localStorage.length);
    this.totalChatConversation =
      this.chatDataService.getTotalChatConversation();

    this.chatDataService.getTotalChatConversation();
    if (this.totalChatConversation >= 1) {
      const currKey = localStorage.key(0);
      this.defaultConversation = currKey ? currKey : '';
    }
    for (let i = 0; i < this.totalChatConversation; i++) {
      const currentKeyString = localStorage.key(i);
      if (currentKeyString !== null && currentKeyString !== 'apiKey') {
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
    this.chatDataService.setTotalChatConversation(1);
    const newChatKey = uuidv4();
    this.keys.push(newChatKey);
    let newChatDataArray: Message[] = [];
    if (data) {
      newChatDataArray = [...data];
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
    const currChatName = this.chatDataService.getLocalStorage(key);
    return currChatName ? JSON.parse(currChatName)[0]?.chatName : '';
  }

  onChatBoxClick(uuid: string) {
    this.chatService.triggerEventForChatNavigation(uuid);
    this.router.navigate(['/chat', uuid]);
  }

  dialog() {
    const dialogRef = this.dialogModel.open(UserDialogComponent, {
      data: {
        message:
          "It's not stored in our end, it's only available in your browser localStorage",
        title: 'Please enter you API key',
      },
      width: '350px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.apiKey = result.apiKey;
        this.chatService.updateConfiguration(this.apiKey);
      }
      this.chatDataService.setAPIKeyToLocalStore(this.apiKey);
      // console.log(`Dialog result: ${result.apiKey}  ${JSON.stringify(result)}`);
    });
  }
}

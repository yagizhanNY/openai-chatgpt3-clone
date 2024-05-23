import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ApiKeyService } from '../services/api-key.service';
import { ChatCompletionMessage } from 'openai/resources';
import { ChatDataService } from '../services/chat-data.service';
import ChatHistories from '../shared/models/chat-histories.model';
import { ChatHistoryDetails } from '../shared/models/chat-history-details.model';
import { ChatService } from '../services/chat.service';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  constructor(
    private chatDataService: ChatDataService,
    private chatService: ChatService,
    private dialogModel: MatDialog,
    private apiKeyService: ApiKeyService
  ) {}

  messages: ChatCompletionMessage[] = [];
  chatHistories: ChatHistories = {
    chatHistoryDetails: [],
  };
  userDialogBox!: MatDialogRef<UserDialogComponent>;
  apiKey: string = '';
  isHistoricalChat: boolean = false;

  ngOnInit(): void {
    this.chatService.getMessagesSubject().subscribe((messages) => {
      this.messages = messages;
    });
    this.chatHistories = this.getCurrentChatHistoriesFromLocalStorage();
  }

  async addNewChat() {
    if (this.isHistoricalChat === false) {
      const chatHistoryId = uuidv4();
      const title = (await this.chatService.getTitleFromChatGpt(this.messages))
        .choices[0].message?.content!;

      const chatHistory: ChatHistoryDetails = {
        id: chatHistoryId,
        messages: this.messages,
        title: title,
      };

      this.chatHistories = this.getCurrentChatHistoriesFromLocalStorage();

      if (this.checkIsChatHistoryExists(chatHistory.id) === false) {
        this.chatHistories.chatHistoryDetails.unshift(chatHistory);

        this.setChatHistoriesToLocalStorage(this.chatHistories);
      }
    }
    this.chatService.setMessagesSubject([]);
    this.isHistoricalChat = false;
  }

  getHistoryChatMessages(id: string) {
    const history = this.chatHistories.chatHistoryDetails.find(
      (c) => c.id === id
    );

    if (history) {
      this.chatService.setMessagesSubject(history.messages);
      this.isHistoricalChat = true;
    }
  }

  getCurrentChatHistoriesFromLocalStorage(): ChatHistories {
    const currentHistories = localStorage.getItem('chatHistories');

    if (currentHistories) {
      const histories = JSON.parse(currentHistories) as ChatHistories;
      return {
        chatHistoryDetails: histories.chatHistoryDetails,
      };
    }

    return {
      chatHistoryDetails: [],
    };
  }

  setChatHistoriesToLocalStorage(chatHistories: ChatHistories) {
    localStorage.setItem('chatHistories', JSON.stringify(chatHistories));
  }

  deleteHistoricalChat(id: string) {
    this.chatHistories.chatHistoryDetails =
      this.chatHistories.chatHistoryDetails.filter((c) => c.id !== id);

    this.setChatHistoriesToLocalStorage(this.chatHistories);
  }

  dialog() {
    const dialogRef = this.dialogModel.open(UserDialogComponent, {
      data: {
        message:
          "It's not stored in our end, it's only available in your browser localStorage",
        title: 'Please enter your API key',
      },
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.apiKey = result.apiKey;

        // Emit the api key event with new api key.
        this.apiKeyService.setApiKey(this.apiKey);

        this.chatService.updateConfiguration();
      }
      this.chatDataService.setAPIKeyToLocalStore(this.apiKey);
    });
  }

  private checkIsChatHistoryExists(id: string) {
    const result = this.chatHistories.chatHistoryDetails.some(
      (c) => c.id === id
    );
    return result;
  }
}

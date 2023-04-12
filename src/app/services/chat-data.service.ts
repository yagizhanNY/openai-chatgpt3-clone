import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Message } from '../shared/models/message.model';

@Injectable({
  providedIn: 'root',
})
export class ChatDataService {
  constructor(private store: Store) {}

  public setLocalStorage(chatName: string, chatData: Message[]): void {
    localStorage.setItem(`${chatName}`, JSON.stringify(chatData));
    // this.store.dispatch(
    //   actionStorageUpdate({ newChatData: { chatName, chatData } })
    // );
  }

  public getLocalStorage(chatName: string) {
    return localStorage.getItem(chatName);
  }
}

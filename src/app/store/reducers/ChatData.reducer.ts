import { ActionReducerMap, createReducer, on } from '@ngrx/store';
// import { LocalStorageState } from '../../shared/models/chat-data-storage.model';
import { Message } from 'src/app/shared/models/message.model';
import * as ChatApplication from '../actions/ChatData.action';

export interface LocalStorageState {
  // id: string;
  data: Message[];
}

export const initialState: LocalStorageState = {
  data: [],
};

export const chatDataReducer = createReducer(
  initialState.data,
  on(ChatApplication.updateChatDataAction, (state, { newChatMessage }) => [
    ...state,
    newChatMessage,
  ])
);

export const reducers: ActionReducerMap<LocalStorageState> = {
  data: chatDataReducer,
};

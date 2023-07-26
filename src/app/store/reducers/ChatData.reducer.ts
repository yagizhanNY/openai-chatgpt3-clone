import { ActionReducerMap, createReducer, on } from '@ngrx/store';
// import { LocalStorageState } from '../../shared/models/chat-data-storage.model';
import * as ChatApplication from '../actions/ChatData.action';
import { ChatCompletionRequestMessage } from 'openai';

export interface LocalStorageState {
  // id: string;
  data: ChatCompletionRequestMessage[];
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

import { createAction, props } from '@ngrx/store';
import { LocalStorageState } from '../../shared/models/chat-data-storage.model';
import { Message } from '../../shared/models/message.model';

export const updateChatDataAction = createAction(
  '[Chat Update Action] Add Chat Data',
  props<{ newChatMessage: Message }>()
);

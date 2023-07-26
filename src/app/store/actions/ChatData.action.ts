import { createAction, props } from '@ngrx/store';
import { ChatCompletionRequestMessage } from 'openai';

export const updateChatDataAction = createAction(
  '[Chat Update Action] Add Chat Data',
  props<{ newChatMessage: ChatCompletionRequestMessage }>()
);

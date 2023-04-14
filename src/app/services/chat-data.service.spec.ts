import { TestBed } from '@angular/core/testing';

import { ChatDataService } from './chat-data.service';

describe('ChatDataService', () => {
  let service: ChatDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

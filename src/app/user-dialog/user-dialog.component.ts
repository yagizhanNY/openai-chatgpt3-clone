import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { ChatDataService } from '../services/chat-data.service';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.css'],
})
export class UserDialogComponent {
  title!: string;
  message!: string;

  loginForm = new FormGroup({
    apiKey: new FormControl(this.chatDataService.getAPIKeyToLocalStore()),
  });

  constructor(
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private chatDataService: ChatDataService
  ) {}

  ngOnInit(): void {
    this.title = this.data.title || 'Default Title';
    this.message = this.data.message || 'Default Message';
  }
  onClose(): void {
    this.dialogRef.close();
  }

  keySubmit(): void {
    if (this.loginForm.valid) {
      this.chatDataService.setAPIKeyToLocalStore(
        this.loginForm.controls.apiKey.value!
      );
    }
    this.dialogRef.close(this.loginForm.value);
  }
}

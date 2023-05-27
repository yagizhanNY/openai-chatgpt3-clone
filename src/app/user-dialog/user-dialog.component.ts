import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.css'],
})
export class UserDialogComponent {
  title!: string;
  message!: string;

  loginForm = new FormGroup({
    apiKey: new FormControl(''),
  });

  constructor(
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.title = this.data.title || 'Default Title';
    this.message = this.data.message || 'Default Message';
  }
  onClose(): void {
    this.dialogRef.close();
  }

  keySubmit(): void {
    if (this.loginForm?.value?.apiKey?.length! <= 0) {
      return;
    }
    this.dialogRef.close(this.loginForm.value);
  }
}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChatComponent } from './chat/chat.component';
import { MarkdownModule } from 'ngx-markdown';
import { NavbarTitleComponent } from './navbar-title/navbar-title.component';
import { ButtonsComponent } from './buttons/buttons.component';
import { SidebarComponent } from './sidebar/sidebar.component';

import { EffectsModule } from '@ngrx/effects';
import { ChatContentComponent } from './chat/chat-content/chat-content.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    NavbarTitleComponent,
    ButtonsComponent,
    SidebarComponent,
    ChatContentComponent,
    UserDialogComponent,
  ],
  imports: [
    EffectsModule.forRoot([]),
    BrowserModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    AppRoutingModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatInputModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MarkdownModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [UserDialogComponent],
})
export class AppModule {}

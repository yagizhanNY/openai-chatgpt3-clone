import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { ButtonsComponent } from './buttons/buttons.component';
import { ChatComponent } from './chat/chat.component';
import { ChatContentComponent } from './chat/chat-content/chat-content.component';
import { EffectsModule } from '@ngrx/effects';
import { FormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NavbarTitleComponent } from './navbar-title/navbar-title.component';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SidebarComponent } from './sidebar/sidebar.component';
import { UserDialogComponent } from './user-dialog/user-dialog.component';

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
})
export class AppModule {}

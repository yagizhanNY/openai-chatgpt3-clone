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

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { reducers } from './store/reducers/ChatData.reducer';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    NavbarTitleComponent,
    ButtonsComponent,
    SidebarComponent,
  ],
  imports: [
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MarkdownModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

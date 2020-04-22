import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import * as firebase from 'firebase/app';

import { ChatMessage } from '../models/chat-message.model';


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  user: firebase.User;
  chatMessages: Observable<ChatMessage[]>;
  chatMessage: ChatMessage;
  userName: string;

  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(auth => {
      if (auth !== undefined && auth !== null) {
        this.user = auth;
      }

      this.getUser().subscribe(a => {
        this.userName = a.displayName;
      });
    });
  }

  getUser(): Observable<any> {
    const userId = this.user.uid;
    const path = `/users/${userId}`;
    return this.db.object(path).valueChanges();
  }

  getUsers() {
    const path = '/users';
    return this.db.list(path);
  }

  sendMessage(msg: string) {
    const email = this.user.email;
    this.chatMessages = this.getMessages();
    this.db.list<ChatMessage>('messages').push({
      message: msg,
      timeSent: Date.now(),
      userName: this.userName,
      email: email
    });
    console.log('Called sendMessage()!');
  }


  getMessages(): Observable<ChatMessage[]> {
    // query to create our message feed binding
    return this.db.list<ChatMessage>('messages', ref => ref.orderByKey().limitToLast(25)).valueChanges();
  }
}

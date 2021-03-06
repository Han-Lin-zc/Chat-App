import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user: Observable<firebase.User>;
  userEmail: string;
  password: string;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.user = this.authService.authUser();
    this.user.subscribe(user => {
      if(user) {
        this.userEmail = user.email;
      }
    });
  }

  login() {
    this.authService.login(this.userEmail, this.password);
  }

  logout() {
    this.authService.logout();
  }
}

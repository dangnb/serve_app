import { user } from './../_models/user';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
const TOKENTIME = 'token-time';
const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  private currentUserSubject: BehaviorSubject<user>;
  public currentUser: Observable<user>;
  private currentTokenSubject: BehaviorSubject<string>;
  public currentToken: Observable<string>;

  constructor() {
    this.currentUserSubject = new BehaviorSubject<user>(JSON.parse(localStorage.getItem(USER_KEY)));
    this.currentUser = this.currentUserSubject.asObservable();
    this.currentTokenSubject = new BehaviorSubject<string>(localStorage.getItem(TOKEN_KEY))
    this.currentToken = this.currentTokenSubject.asObservable();
  }

  signOut() {
    localStorage.removeItem(USER_KEY);
    this.currentUserSubject.next(null);
  }
  public saveToken(token: string) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, token);
    this.currentTokenSubject.next(token);
  }
  public saveUser(user) {
    debugger;
    localStorage.removeItem(USER_KEY);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
}
import { environment } from './../../environments/environment.prod';
import { TokenStorageService } from './token-storage.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { user } from '../_models';
const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const USER_LOGIN_KEY = 'auth-login-user';
@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<user>;
    public currentUser: Observable<user>;
    public userCurrent: user;
    public token: string;
    constructor(private http: HttpClient, private tokenStorageService: TokenStorageService) {
        this.currentUserSubject = new BehaviorSubject<user>(JSON.parse(localStorage.getItem(USER_KEY)));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): user {
        return this.currentUserSubject.value;
    }
    login(username, password) {
        const body = { 'username': username, 'password': password }
        return this.http.post<any>(`${environment.url}/authenticate`, body).pipe(map(
            res => {
                let item = JSON.parse(JSON.stringify(res));
                if (item.err == null) {
                    let u: user = item.jwrRes.user;
                    u.token = "fake-jwt-token";
                    this.tokenStorageService.saveToken(item.jwrRes.token);
                    localStorage.removeItem(USER_KEY);
                    localStorage.setItem(USER_KEY, JSON.stringify(u));
                    this.currentUserSubject.next(u);
                }
            }
        ));
    }
    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(USER_LOGIN_KEY);
        this.currentUserSubject.next(null);
    }
}
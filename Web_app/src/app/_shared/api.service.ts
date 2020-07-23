import { ResultApi } from './../_models/ResultAPI';
import { environment } from './../../environments/environment.prod';
import { TokenStorageService } from './../_services/token-storage.service';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, catchError } from 'rxjs/operators';
@Injectable({ providedIn: 'root' })
export class ApiService {
    private token: string;
    constructor(private http: HttpClient,
        private tokenStorageService: TokenStorageService) {
        this.tokenStorageService.currentToken.subscribe(token => {
            this.token = token;
        });
    }
    public GetByKey(id, urlApi: string): Observable<any> {
        this.tokenStorageService.currentToken.subscribe(token => {
            this.token = token;
        });
        let url = environment.url + urlApi;
        return this.http.post<ResultApi>(url, null, {
            params: {
                id: id,
                Authorization: `Bearer  ${this.token}`
            }
        }).pipe(
            tap(response => console.log(`response: ${JSON.stringify(response)}`)),
            catchError(error => of([]))
        );
    }
    public getAllList(input: any, urlApi: string): Observable<any> {
        let url = environment.url + urlApi;
        return this.http.post<ResultApi>(url, input, {
            params: {
                Authorization: `Bearer  ${this.token}`
            }
        }).pipe(
            tap(response => response),
            catchError(error => of([]))
        );
    }
    CreateOrUpdate(model: any, urlApi: string): Promise<any> {
        let url = environment.url + urlApi;
        var promise = this.http.post(url, model, {
            params: {
                Authorization: `Bearer  ${this.token}`
            }
        })
            .toPromise()
            .then(response => response as any)
            .catch(error => {
                return null;
            });
        return promise;
    }
    Delete(model: any, urlApi: string): Promise<any> {
        let url = environment.url + urlApi;
        var promise = this.http.post(url, null, {
            params: {
                id: model.id,
                Authorization: `Bearer  ${this.token}`
            }
        })
            .toPromise()
            .then(response => response as any)
            .catch(error => {
                return null;
            });
        return promise;
    }
}
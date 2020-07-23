import { environment } from './../../../environments/environment';
import { SupplierModel } from './supplier-model';
import { ResultApi } from '../../_models/ResultAPI';
import { Observable, of } from 'rxjs';
import { TokenStorageService } from '../../_services/token-storage.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, catchError } from 'rxjs/operators';
@Injectable({ providedIn: 'root' })
export class SupplierService {
    private token: string;

    private urlGetALL = '/Supplier/getAllSupplier';
    private urlCreate = '/Supplier/create';
    private urlDelete = '/Supplier/delete';

    constructor(private http: HttpClient,
        private tokenStorageService: TokenStorageService) {
        this.tokenStorageService.currentToken.subscribe(token => {
            this.token = token;
        });
    }

    public getAllSupplier(input: any): Observable<any> {

        let url = environment.url + this.urlGetALL;
        return this.http.post<ResultApi>(url, input, {
            params: {
                Authorization: `Bearer  ${this.token}`
            }
        }).pipe(
            tap(response => console.log(`response: ${JSON.stringify(response)}`)),
            catchError(error => of([]))
        );
    }
    Create(supplierModel: SupplierModel): Promise<any> {
        let url = environment.url + this.urlCreate;
        var promise = this.http.put(url, supplierModel, {
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
    Delete(supplierModel: SupplierModel): Promise<any> {
        let url = environment.url + this.urlDelete;
        var promise = this.http.put(url, supplierModel, {
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
}
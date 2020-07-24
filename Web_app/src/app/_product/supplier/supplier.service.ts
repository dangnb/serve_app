import { AuthenticationService } from './../../_services/authentication.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from './../../../environments/environment';
import { SupplierModel } from './supplier-model';
import { ResultApi } from '../../_models/ResultAPI';
import { Observable, of } from 'rxjs';
import { TokenStorageService } from '../../_services/token-storage.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, catchError } from 'rxjs/operators';
import * as _ from 'lodash';
@Injectable({ providedIn: 'root' })
export class SupplierService {
    private token: string;
    private urlGetALL = '/Supplier/getAllSupplier';
    private urlCreate = '/Supplier/create';
    private urlDelete = '/Supplier/delete';

    constructor(
        private http: HttpClient,
        private tokenStorageService: TokenStorageService,
        private authenticationService: AuthenticationService,
        public formBuilder: FormBuilder
    ) {
        this.tokenStorageService.currentToken.subscribe(token => {
            this.token = token;
        });
    }
    form: FormGroup = this.formBuilder.group({
        supplierId: new FormControl(),
        name: new FormControl("", Validators.compose([
            Validators.required
        ])),
        address: new FormControl(),
        code: new FormControl("", Validators.compose([
            Validators.required
        ])),
        createdDate: new Date(),
        createdBy: this.authenticationService.currentUserValue.userName,
        status: true,
    });
    initializeFormGroup() {
        this.form.setValue({
            supplierId: '',
            name: '',
            address: '',
            code: '',
            createdDate: new Date(),
            createdBy: this.authenticationService.currentUserValue.userName,
            status: true,
        });
    }
    populateForm(supplier) {
        this.form.setValue(_.omit(supplier));
    }
    public getAllSupplier(input: any): Observable<any> {

        let url = environment.url + this.urlGetALL;
        return this.http.post<ResultApi>(url, input, {
            params: {
                Authorization: `Bearer  ${this.token}`
            }
        }).pipe(
            tap(response => response),
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
import { environment } from './../../../../environments/environment';
import { Validators } from '@angular/forms';
import { tap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import * as _ from 'lodash';
import { TokenStorageService } from 'src/app/_services';
import { ResultApi } from 'src/app/_models/ResultAPI';
@Injectable({ providedIn: 'root' })
export class CategoryProductService {
    private token: string;
    private urlGetALL = '/CategoryProduct/getListAll';
    private urlCreate = '/CategoryProduct/create';
    private urlDelete = '/CategoryProduct/delete';
    constructor(private http: HttpClient,
        private tokenStorageService: TokenStorageService) {

    }
    form: FormGroup = new FormGroup({
        id: new FormControl(),
        name: new FormControl(),
        phoneNumber: new FormControl('', [Validators.required, Validators.minLength(8)]),
        code: new FormControl(),
        createdDate: new FormControl(),
        createdBy: new FormControl(),
        status: new FormControl(),
        email: new FormControl(),
    });
    initializeFormGroup() {
        this.form.setValue({
            id: '',
            name: '',
            phoneNumber: '',
            code: '',
            createdDate: '',
            createdBy: '',
            status: true,
            email: '',
        });
    }

    populateForm(categoryProduct) {
        this.form.setValue(_.omit(categoryProduct));
    }

    public getAllList(input: any): Observable<any> {
        this.tokenStorageService.currentToken.subscribe(token => {
            this.token = token;
        });
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
    Delete(categoryProductModel: any): Promise<any> {
        let url = environment.url + this.urlDelete;
        var promise = this.http.put(url, categoryProductModel, {
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
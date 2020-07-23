import { Observable } from 'rxjs';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { TokenStorageService } from './../../_services/token-storage.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
@Injectable({ providedIn: 'root' })
export class AccountService {
    token: string;
    constructor(private http: HttpClient,
        private tokenStorageService: TokenStorageService,
        public formBuilder: FormBuilder) {
        this.tokenStorageService.currentToken.subscribe(token => {
            this.token = token;
        });

    }
    form: FormGroup = this.formBuilder.group({
        id: new FormControl(),
        address: new FormControl(),
        type: new FormControl(),
        password: new FormControl('', Validators.compose([
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(30)
        ])),
        confirmPassword: new FormControl('', Validators.compose([
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(30)
        ])),
        birtDay: new FormControl('', Validators.compose([
            Validators.required,
        ])),
        phoneNumber: new FormControl(),
        userName: new FormControl('', Validators.compose([
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(30)
        ])),
        code: new FormControl('', Validators.compose([
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(30)
        ])),
        status: new FormControl(),
        fullName: new FormControl(),
        createdDate: new FormControl(),
        createdBy: new FormControl(),
        email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
    }, {
        validators: this.password.bind(this)
    });
    password(formGroup: FormGroup) {
        const { value: password } = formGroup.get('password');
        const { value: confirmPassword } = formGroup.get('confirmPassword');
        return password === confirmPassword ? null : { passwordNotMatch: true };
    }
    error_messages = {
        'userName': [
            { type: 'required', message: 'First Name is required.' },
        ],
        'address': [
            { type: 'required', message: 'Last Name is required.' }
        ],
        'email': [
            { type: 'required', message: 'Email is required.' },
            { type: 'minlength', message: 'Email length.' },
            { type: 'maxlength', message: 'Email length.' },
            { type: 'required', message: 'please enter a valid email address.' }
        ],
        'password': [
            { type: 'required', message: 'password is required.' },
            { type: 'minlength', message: 'password length.' },
            { type: 'maxlength', message: 'password length.' }
        ],
        'confirmPassword': [
            { type: 'required', message: 'password is required.' },
            { type: 'minlength', message: 'password length.' },
            { type: 'maxlength', message: 'password length.' }
        ],
    }

    initializeFormGroup() {
        this.form.setValue({
            id: '',
            address: '',
            type: '',
            password: '',
            confirmPassword: '',
            birtDay: '',
            phoneNumber: '',
            userName: '',
            code: '',
            status: true,
            fullName: '',
            createdDate: '',
            createdBy: '',
            email: '',
        });
    }
    populateForm(account) {
        this.form.setValue(_.omit(account));
    }
}
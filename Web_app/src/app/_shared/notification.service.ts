import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    constructor(
        public snackBar: MatSnackBar,
        private toastr: ToastrService
    ) { }
    config: MatSnackBarConfig = {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
    }
    showSuccess(message) {
        this.toastr.success(message, "Success")
    }
    showError(title, message) {
        this.toastr.error(message, title)
    }
    showInfo(message, title) {
        this.toastr.info(message, title)
    }
    showWarning(message, title) {
        this.toastr.warning(message, title)
    }
}

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { variable } from "@angular/compiler/src/output/output_ast";
/**
 * @target: Dùng để định nghĩa forms: tạo, sửa, chi tiết
 */

export class LoginForm {
    /**
  * @description Định nghĩa form tạo
  * @param fb 
  */
    static loginForm(fb: FormBuilder):
        FormGroup {
        var loginForm: FormGroup;
        loginForm=fb.group({
            username:"",
            password:"",
        });
        return loginForm;
    }
}
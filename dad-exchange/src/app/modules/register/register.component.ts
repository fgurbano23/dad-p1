import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoginService} from "../../services/login.service";
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {ToastService} from "../../services/toast.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private loginService: LoginService, private router: Router, private toast :ToastService) {
    this.form = this.fb.group({
      name: [ null, [Validators.required]],
      surname: [ null, [Validators.required]],
      username: [ null, [Validators.required]],
      password: [ null, [Validators.required]]
    })
  }

  ngOnInit() {
  }

  async submit() {
    try {
      const res: any  = await this.loginService.register(this.form.value)
      window.localStorage.setItem('token', res?.token)
      this.loginService.events.next(true);
      await this.router.navigate(['/balance'])
    } catch (e) {
      if (e instanceof HttpErrorResponse) {

        if (e.error.data){
          this.toast.show(e.error.data,{ classname: 'bg-danger text-light', delay: 10000 })
        } else {
          this.toast.show('Ha ocurrido un error',{ classname: 'bg-danger text-light', delay: 10000 })
        }

      } else {
        this.toast.show('Ha ocurrido un error',{ classname: 'bg-danger text-light', delay: 10000 })
      }
      console.log(e)
    }
  }
}

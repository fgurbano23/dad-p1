import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoginService} from "../../services/login.service";
import {Router} from "@angular/router";
import {ToastService} from "../../services/toast.service";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

  form: FormGroup;

  constructor(private fb: FormBuilder, private loginService: LoginService, private router: Router, public toast: ToastService) {
    this.form = this.fb.group({
      username: [ null, [Validators.required]],
      password: [ null, [Validators.required]]
    })
  }

  ngOnInit() {

  }
  async submit() {
    try {
      const res: any  = await this.loginService.login(this.form.value)
      window.localStorage.setItem('token', res?.token)
      this.loginService.events.next(true);
      await this.router.navigate(['/balance'])
      this.toast.show('Bienvenido',{ classname: 'bg-success text-light', delay: 10000 })
    } catch (e: any) {
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

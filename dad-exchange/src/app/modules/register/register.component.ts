import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoginService} from "../../services/login.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private loginService: LoginService, private router: Router) {
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
      console.log(e)
    }
  }
}

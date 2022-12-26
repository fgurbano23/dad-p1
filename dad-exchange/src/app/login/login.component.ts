import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoginService} from "../services/login.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

  form: FormGroup;

  constructor(private fb: FormBuilder, private loginService: LoginService, private router: Router) {
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
      await this.router.navigate(['/balance'])
    } catch (e) {
      console.log(e)
    }
  }
}

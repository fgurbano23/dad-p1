import {Component, OnInit} from '@angular/core';
import {NodeService} from "../../services/node.service";
import {LoginService} from "../../services/login.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{

    show = false
    constructor(public nodeService: NodeService, public loginService: LoginService) {
    }

    ngOnInit() {
      this.show = Boolean(window.localStorage.getItem('token'))
      this.loginService.events?.subscribe((loginStatus: any) => {
        this.show = loginStatus
      })
    }

}

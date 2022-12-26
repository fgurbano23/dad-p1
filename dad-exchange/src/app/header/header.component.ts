import { Component } from '@angular/core';
import {NodeService} from "../services/node.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
    constructor(public nodeService: NodeService) {
    }
}

import { Injectable } from '@angular/core';
import {environment} from "src/environment/environment";

@Injectable({
  providedIn: 'root'
})
export class NodeService {
  constructor() { }

  target = environment.node
}

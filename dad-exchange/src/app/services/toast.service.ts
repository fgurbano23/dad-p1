import { Injectable } from '@angular/core';

export interface ToastInfo {
  header: string;
  body: any;
  delay?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts: ToastInfo[] = [];
  constructor() { }

  show(header: string, body: any) {
    this.toasts.push({header, body});
  }

  remove(toast: ToastInfo) {
    this.toasts = this.toasts.filter(t => t != toast);
  }
}

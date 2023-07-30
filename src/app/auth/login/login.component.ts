import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy{
  isLoading = false
  authStatus!: Subscription
  
  constructor(private service: AuthService) {}

  ngOnDestroy(): void {
    this.authStatus.unsubscribe()
  }

  ngOnInit(): void {
    this.authStatus = this.service.getListener().subscribe(res => {
      this.isLoading = false
    })
  }
  
  onSave(form: NgForm) {
    if (form.invalid) return
    this.isLoading = true
    this.service.loginUser(form.value.email, form.value.password)
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy{
  isLoading = false
  authStatus!: Subscription

  constructor(public service: AuthService){}

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
    this.service.createUser(form.value.name, form.value.email, form.value.password)
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{
  private authListener!: Subscription
  isLogin: boolean = false
  userName: string = ''

  constructor(private service: AuthService) {}

  ngOnInit(): void {
    this.isLogin = this.service.getIsLogin()
    this.authListener = this.service.getListener()
      .subscribe(res => this.isLogin = res)
  }

  ngOnDestroy(): void {
    this.authListener.unsubscribe()    
  }

  logout() {
    this.service.logoutUser()
  }
}

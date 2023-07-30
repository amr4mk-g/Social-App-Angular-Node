import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Subject } from 'rxjs'
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AuthService {
  private apiURL = 'http://localhost:3000/api/user/'
  private listener = new Subject<boolean>()
  private isLogin = false
  private token!: string
  private userId!: string

  constructor(private http: HttpClient, private router: Router) { }

  createUser(name: string, email: string, password: string) {
    this.http.post<{token:string, expire:number, userId:string}>
      (this.apiURL+'signup', {name, email, password}).subscribe(res => {
        let date = new Date(new Date().getTime()+(res.expire*3600*1000))
        this.saveAuth(res.token, date)
        this.setLogoutTimer(res.expire)
        if (res.token) { this.setData(res.token);  this.userId = res.userId; }
      }, err => this.listener.next(false) )
  }

  loginUser(email: string, password: string) {
    this.http.post<{token:string, expire:number, userId:string}>
      (this.apiURL+'login', {email, password}).subscribe(res => {
        let date = new Date(new Date().getTime()+(res.expire*3600*1000))
        this.saveAuth(res.token, date)
        this.setLogoutTimer(res.expire)
        if (res.token) { this.setData(res.token);  this.userId = res.userId; }
      }, err => this.listener.next(false) )
  }

  logoutUser() {
    clearTimeout(this.tokenTimer)
    this.clearAuth()
    this.userId = ''
    this.setData('')
  }

  setData(token: string) {
    this.token = token || ''
    this.isLogin = !!token
    this.listener.next(!!token)
    this.router.navigate(['/'])
  }

  getToken() { return this.token }
  getListener() { return this.listener.asObservable() }
  getIsLogin() { return this.isLogin }
  getUserId() { return this.userId }

  private tokenTimer: any
  private setLogoutTimer(hours: number) {
    this.tokenTimer = setTimeout(() => this.logoutUser(), hours*3600*1000)
  }
  private saveAuth(token: string, date: Date) {
    localStorage.setItem('token', token)
    localStorage.setItem('expire', date.toISOString())
    localStorage.setItem('userId', this.userId)
  }
  private clearAuth() {
    localStorage.removeItem('token')
    localStorage.removeItem('expire')
    localStorage.removeItem('userId')
  }
  autoAuth() {
    let token = localStorage.getItem('token')
    let expire = localStorage.getItem('expire')
    let userId = localStorage.getItem('userId')
    if (!token || !expire) return
    let diff = new Date(expire).getTime() - new Date().getTime()
    if (diff <= 0) return
    this.userId = userId!
    this.setLogoutTimer(diff/(3600*1000))
    this.setData(token)
  }
}

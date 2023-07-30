import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post.model'
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy{
  posts: Post[] = []; 
  private sub!: Subscription 
  isLoading = false
  private authListener!: Subscription
  isLogin = false
  userId = ''
  curr = 1
  total = 0
  perPage = 5
  options = [5, 10, 25, 50]

  constructor(private service: PostService, private auService: AuthService) {}

  ngOnInit(): void {
    this.isLoading = true
    this.service.getPosts(this.perPage, this.curr)
    this.sub = this.service.updatedListener().subscribe(res => {
      this.posts = res.posts
      this.total = res.count
      this.isLoading = false
    })
    this.isLogin = this.auService.getIsLogin()
    this.userId = this.auService.getUserId()
    this.authListener = this.auService.getListener()
      .subscribe(res => { this.isLogin = res;  this.userId = this.auService.getUserId(); } )
  }

  ngOnDestroy() {
    this.sub?.unsubscribe()
    this.authListener.unsubscribe() 
  }

  onDelete(id: string) {
    this.isLoading = true
    this.service.deletePost(id).subscribe(res => 
      this.service.getPosts(this.perPage, this.curr),
      err => { this.isLoading = false })
  }

  onChange(event: PageEvent) {
    this.isLoading = true
    this.curr = event.pageIndex + 1
    this.perPage = event.pageSize
    this.service.getPosts(this.perPage, this.curr)
  }
}

import { Injectable } from '@angular/core';
import { Post } from './post.model'
import { Subject, pipe } from 'rxjs'
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class PostService {
  private posts: Post[] = []
  private updated = new Subject<{count: number, posts: Post[]}>()
  private apiURL = 'http://localhost:3000/api/posts/'
  
  constructor(private http: HttpClient, private rou: Router) {}  

  updatedListener() {
    return this.updated.asObservable()
  }

  getPosts(size: number, page: number) {
    let query = '?size='+size+'&page='+page
    this.http.get<{max: number, posts: Post[]}>(this.apiURL.slice(0,-1)+query) 
      .subscribe(res =>{
          this.posts = res.posts
          this.updated.next({count: res.max, posts: [...this.posts]})
      }, err=>{ console.log(err) })
  } 

  getPost(id: string) {
    return this.http.get<{post: Post}>(this.apiURL+id)
  }

  addPost(title: string, desc: string, image: File) {
    let p = new FormData()
    p.append('title', title)
    p.append('desc', desc)
    p.append('image', image, title)
    this.http.post<{post: Post}>(this.apiURL, p).subscribe(
      res => this.rou.navigate(['/']), err => console.log(err))
  }

  deletePost(id: string) {
    return this.http.delete(this.apiURL+id)
  }

  updatePost(id: string, title: string, desc: string, image: any) {
    let post: any
    if (typeof(image) == 'object') {
      post = new FormData()
      post.append('_id', id)
      post.append('title', title)
      post.append('desc', desc)
      post.append('image', image, title)
    } else {
      post = {_id:id, title, desc, imagePath: image, creator: ''}
    }
    this.http.put(this.apiURL+id, post)
      .subscribe(res => this.rou.navigate(['/']), err => console.log(err))
  }
}

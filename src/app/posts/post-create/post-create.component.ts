import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy{
  authStatus!: Subscription
  title = ''
  desc = ''
  edit = false 
  postId!: string
  isLoading = false
  form!: FormGroup
  preview!: string

  constructor(public service: PostService, private rou: ActivatedRoute, private authS: AuthService) {}

  ngOnInit(): void {
    this.authStatus = this.authS.getListener().subscribe(res => this.isLoading = false)
    this.form = new FormGroup({
      'title': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'desc': new FormControl('', [Validators.required]),
      'image': new FormControl('', [Validators.required])
    })
    this.rou.paramMap.subscribe(params =>{ 
      if (params.has('id')) {
        this.isLoading = true
        this.edit = true
        this.postId = params.get('id')!
        this.service.getPost(this.postId).subscribe(result =>{
          this.isLoading = false
          this.title = result.post.title
          this.desc = result.post.desc
          this.preview = result.post.imagePath 
       //   this.creator = result.post.creator
          this.form.setValue({title: this.title, desc: this.desc, image: result.post.imagePath})
        })
      }
    })
  }

  ngOnDestroy(): void {
    this.authStatus.unsubscribe()
  }

  onSave() {
    if (this.form.invalid) return
    this.isLoading = true
    let t = this.form.value.title, d = this.form.value.desc
    if (this.edit) this.service.updatePost(this.postId, t, d, this.form.value.image)
    else this.service.addPost(t, d, this.form.value.image) 
    this.form.reset()
  }

  picked(event: Event) {
    let ele = event.target as HTMLInputElement
    if (ele.files) {
      let file = ele.files[0]
      if (!file.type.startsWith('image/')) return
      this.form.patchValue({image: file})
      this.form.get('image')?.updateValueAndValidity()
      let reader = new FileReader()
      reader.onload = () => this.preview = reader.result as string
      reader.readAsDataURL(file)
    }
  }
}

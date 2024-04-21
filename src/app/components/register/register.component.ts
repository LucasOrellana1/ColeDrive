import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { authService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports : [ReactiveFormsModule]
})

export class RegisterComponent {
  fb = inject(FormBuilder)
  //Servicio personalizado de auth
  authService = inject(authService)
  router = inject(Router);

  errorMessage: string | null = null;
  
  baseform = this.fb.nonNullable.group(
    {
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],

    }
  )
  familyForm = this.fb.nonNullable.group(
    {
      rut: ['', Validators.required],
      fNames: ['', Validators.required],
      lNames: ['', Validators.required],
      bDate: ['', Validators.required],
      childs: ['', Validators.required],
    }
  )



  onSubmit(): void {
    console.log("Register")
    const rawForm = this.baseform.getRawValue();
    this.authService.register(rawForm.email, rawForm.username,rawForm.password)
    .subscribe({
      next:() => {this.router.navigateByUrl('/')},
      error: (error) => {
        this.errorMessage = error.code
        console.log(this.errorMessage)
      }
      }
    )
  }
}

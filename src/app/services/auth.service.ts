import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class authService {
  firebaseAuth = inject(Auth);

  register(email: string, username: string, password: string): Observable<void>{
    const promise = createUserWithEmailAndPassword(this.firebaseAuth, email, password)
    .then(response => updateProfile(response.user, {displayName:username}));
    
    return from(promise)
  }

  login(email:string, password: string):Observable<void>{
    // la funcion final vacia es para que ts no caiga
    const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password).then(()=>{});

    return from(promise)
  }

}

import { Injectable, inject, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, user } from '@angular/fire/auth';
import { signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Observable, from } from 'rxjs';
import { UserInterface } from './user.interface';

@Injectable({
  providedIn: 'root'
})


export class authService {
  firebaseAuth = inject(Auth);
  user$ = user(this.firebaseAuth)
  
  //currentUser = signal<UserInterface|null|undefined> (undefined)
  // : Observable<void> 

  register(email: string, username: string, password: string){
    const promise = createUserWithEmailAndPassword(this.firebaseAuth, email, password)
    .then(response => updateProfile(response.user, {displayName:username}));
    
    return promise
  }

  login(email:string, password: string){
    // la funcion final vacia es para que ts no caiga
    const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password).then(()=>{});

    return promise
  }

}

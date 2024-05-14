import { Injectable, inject, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, user } from '@angular/fire/auth';
import { signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Observable, from } from 'rxjs';
import { Conductor, UserInterface } from './user.interface';
import { ProfileService } from './profile.service';

@Injectable({
  providedIn: 'root'
})


export class authService {
  firebaseAuth = inject(Auth);
  user$ = user(this.firebaseAuth)
  
  constructor(private profService: ProfileService){}
//


register(email: string, username: string, password: string){
  const promise = createUserWithEmailAndPassword(this.firebaseAuth, email, password)
  .then(response => updateProfile(response.user, {displayName:username}));
  
  return promise
}

async registerDriver(conductor: Conductor, email: string, username: string, password: string){
  const promise = await createUserWithEmailAndPassword(this.firebaseAuth, email, password)
  .then(response => {
      updateProfile(response.user, {displayName:username})
      const uid = response.user.uid 
      this.profService.createDriver(conductor, uid)
      return promise
  }).catch((error) =>{
      console.log(error) 
      return error
  })
}

  login(email:string, password: string){
    // la funcion final vacia es para que ts no caiga
    const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password).then(()=>{});

    return promise
  }

}

import { Injectable, inject, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, user } from '@angular/fire/auth';
import { signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Conductor, Familia, UserInterface } from './user.interface';
import { ProfileService } from './profile.service';

@Injectable({
  providedIn: 'root'
})

export class authService {

  
  constructor(private profService: ProfileService, 
    
    private firebaseAuth : Auth){}

register(email: string, username: string, password: string){
  const promise = createUserWithEmailAndPassword(this.firebaseAuth, email, password)
  .then(response => updateProfile(response.user, {displayName:username}));
  
  return promise
}

async registerFamily(fData: Familia, email: string, username: string, password: string){
  await createUserWithEmailAndPassword(this.firebaseAuth, email, password)
  .then(response => {
      updateProfile(response.user, {displayName:username})
      const uid = response.user.uid 
      this.profService.createFamily(fData, uid)
      
  }).catch((error) => {
      console.log("Error" , error) 
      
      throw error
  })
}

async registerDriver(conductor: Conductor, email: string, username: string, password: string){
  await createUserWithEmailAndPassword(this.firebaseAuth, email, password)
  .then(response => {
      updateProfile(response.user, {displayName:username})
      const uid = response.user.uid 
      this.profService.createDriver(conductor, uid)
  }).catch((error) => {
      console.log("Error" , error) 
      throw error
  })
  }

  login(email:string, password: string){
    // la funcion final vacia es para que ts no caiga
    const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password).then(()=>{});

    return promise
  }

}
  
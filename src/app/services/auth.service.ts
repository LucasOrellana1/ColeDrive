import { Injectable, inject, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, user } from '@angular/fire/auth';
import { signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { CentroPadres, Colegio, Conductor, Familia} from './user.interface';
import { ProfileService } from './profile.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class authService {

  router =  inject(Router);

  constructor(private profService: ProfileService, 
    
  private firebaseAuth : Auth){}

register(email: string, username: string, password: string){
  const promise = createUserWithEmailAndPassword(this.firebaseAuth, email, password)
  .then(response => updateProfile(response.user, {displayName:username}));
  
  return promise
}

async registerFamily(fData: Familia, password: string){
  await createUserWithEmailAndPassword(this.firebaseAuth, fData.email, password)
  .then(response => {
      updateProfile(response.user, {displayName:fData.nombre + ' ' + fData.apellido})
      const uid = response.user.uid 
      this.profService.createUser(fData, uid)
      
  }).catch((error) => {
      console.log("Error" , error) 
      
      throw error
  })
}

async registerDriver(conductor: Conductor, password: string){
  await createUserWithEmailAndPassword(this.firebaseAuth, conductor.email, password)
  .then(response => {
      updateProfile(response.user, {displayName:conductor.nombre})
      const uid = response.user.uid 
      this.profService.createUser(conductor, uid)
  }).catch((error) => {
      console.log("Error" , error) 
      throw error
  })
  }

  async registerParentCenter(cData: CentroPadres, password: string){
      await createUserWithEmailAndPassword(this.firebaseAuth, cData.email, password)
    .then(response => {
        updateProfile(response.user, {displayName:cData.nombre})
        const uid = response.user.uid 
        this.profService.createUser(cData, uid)
      }).catch((error) => {
        console.log("Error" , error) 
        throw error
    })
    }
  
    // Posiblemente deprecada
  async registerSchool(sData: Colegio, password: string){
      await createUserWithEmailAndPassword(this.firebaseAuth, sData.email, password)
    .then(response => {
        updateProfile(response.user, {displayName:sData.nombre})
        const uid = response.user.uid 
        this.profService.createUser(sData, uid)
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


  async signOut() {
    try {
      await this.firebaseAuth.signOut();
      // Redirige a la página de inicio de sesión o a la página de bienvenida después del cierre de sesión
      this.router.navigate(['/inicio']); // Reemplaza '/login' con la ruta de tu página de inicio de sesión
    } catch (error) {
      // Maneja el error aquí
      console.error('Error al cerrar sesión:', error);
    }
  }


}

  
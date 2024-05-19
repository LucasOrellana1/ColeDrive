import { Injectable, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { CollectionReference, addDoc, collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { Observable, finalize, from, map, switchMap, take } from 'rxjs';
import { Colegio, Conductor, Familia } from './user.interface';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
constructor(
  private firestore: Firestore,
  private fire: AngularFirestore, private auth: AngularFireAuth
  ){}
  
    
// Simplificación en una sola funcion y tabla usuarios
  createUser(
    data: Familia | Colegio | Conductor,
    uid: string
  )
  {
    this.fire.collection('Usuarios').doc(uid).set(data);
    console.log("Nuevo usuario registrado: " , data.tipoCuenta, " ", uid)
  }

  // Uid llegare de getCurrentUser()
  async updateUser(
    uid: string,
    data: Familia | Colegio | Conductor)
  {
    return this.fire.collection('Usuarios').doc(uid).set(data);
  }
  
   //  Funciones de obtención de datos
  
   getUserData(uid: string): Observable<any> {
    return this.fire.collection('Usuarios').doc(uid).valueChanges();
  }

  getCurrentUser(): Observable<any> {
    return this.auth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.getUserData(user.uid);
        } else {
          return [null];
        }
      })
    );
  } 

  //FUNCIONES RELACIONADAS A FAMILIAS:
   


  //FUNCIONES RELACIONADAS A COLEGIOS:
    
/*   async createSchool(sData: Colegio, id: string){
    const schoolCollection = collection(this.firestore,'Ususarios');
    const myDocRef = doc(schoolCollection, id)
    const newDocRef = await setDoc(myDocRef, sData);
    console.log('Nuevo colegio añadido con ID' , id)
  }
 */

  async changeStateDriver(conductorId: string, colegioId: string){      
    this.getUserData(conductorId).subscribe(
      data => {
        if (data && data.activado == false){
          this.fire.collection('Usuarios').doc(conductorId).update(
            {
              activado: true
            })}
        else {
          this.fire.collection('Usuarios').doc(conductorId).update(
            {
              activado: false
            })
        }})}


  
  // Query: trae el listado de conductores postulados para activar
  getDriverListAct(comuna: string, colegioId: string){
    this.fire.collection('Usuarios', ref => 
      ref.where('tipoCuenta', '==', 2)
      .where('comuna', '==', comuna)
      .where('colegio', '==', colegioId)
      ).valueChanges().subscribe(data => {
        return data
      });
      
  }

  // Query: trae el listado de conductores disponibles (activados)

  getDriverListDisp(comuna:string, colegioId:string){
    this.fire.collection('Usuarios', ref => 
      ref.where('tipoCuenta', '==', 2)
      .where('comuna', '==', comuna)
      .where('colegio', '==', colegioId)
      .where('activado', '==', true)
      ).valueChanges().subscribe(data => {
        return data
      });
  }

  //Query: Listado de colegios
  getSchoolList():Observable<any>{
    return this.fire.collection('Usuarios', ref =>
      ref.where('tipoCuenta', '==', 3)
    ).valueChanges()
  }
}
  


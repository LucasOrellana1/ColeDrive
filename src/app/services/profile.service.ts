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
  

   //  Funciones de obtención de datos de usuario
   getUserData(uid: string): Observable<any> {
    return this.fire.collection('Usuarios').doc(uid).valueChanges();
  }

  // Obtiene un observable con los datos de la sesión actual
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
  // Funcion para para obtener la lista de todos los hijos registrados
  getHijosList(): Observable<any[]> {
    return this.fire.collection('Usuarios', ref => ref.where('tipoCuenta', '==', 1))
      .valueChanges()
      .pipe(
        map((familias: any[]) => {
          let hijosList: any[] = [];
          familias.forEach(familia => {
            if (familia.hijos) {
              hijosList = hijosList.concat(familia.hijos.map((hijo: any) => ({
                ...hijo,
                familiaNombre: familia.nombre,
                familiaApellido: familia.apellido
              })));
            }
          });
          return hijosList;
        })
      );
  }


  // Funcion para activar o desactivar conductor (Colegio)

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


  // Query: trae el listado de conductores postulados para activar (Colegio)
  getDriverListAct(comuna: string, colegioId: string){
    this.fire.collection('Usuarios', ref => 
      ref.where('tipoCuenta', '==', 2)
      .where('comuna', '==', comuna)
      .where('colegio', '==', colegioId)
      ).valueChanges().subscribe(data => {
        return data
      });
      
  }

 // Postular a colegio (Boton para seleccionar el colegio / Conductor ) 
 selectSchool(conductorId:string, colegioId:string){
  this.fire.collection('Usuarios').doc(conductorId).update(
    {
      colegioId: colegioId
    })
  }

  // Query: trae el listado de conductores disponibles 
  //(activados / vista familias)
 
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

  //Query: Listado de colegios (Conductor)
  getSchoolList():Observable<any>{
    return this.fire.collection('Usuarios', ref =>
      ref.where('tipoCuenta', '==', 3)
    ).valueChanges()
  }
}
  


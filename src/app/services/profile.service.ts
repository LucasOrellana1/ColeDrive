import { Injectable, inject } from '@angular/core';
import { Firestore, arrayUnion } from '@angular/fire/firestore';
import { CollectionReference, addDoc, collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { Observable, finalize, from, map, switchMap, take } from 'rxjs';
import { Colegio, Conductor, Familia, FacturaServicios } from './user.interface';

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
  
  factura: FacturaServicios
    
// Simplificación en una sola funcion y tabla usuarios
  createUser(
    data: Familia | Colegio | Conductor,
    uid: string
  ) {
    this.fire.collection('Usuarios').doc(uid).set(data);
    console.log("Nuevo usuario registrado: ", data.tipoCuenta, " ", uid)
  }

  // Uid llegare de getCurrentUser()
  async updateUser(
    uid: string,
    data: Familia | Colegio | Conductor) {
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

  // Función para obtener la lista de conductores
  getConductoresList(): Observable<any[]> {
    return this.fire.collection('Usuarios', ref => ref.where('tipoCuenta', '==', 2))
      .valueChanges()
      .pipe(
        map((conductores: any[]) => {
          return conductores.map(conductor => ({
            ...conductor,
            nombreCompleto: `${conductor.nombre} ${conductor.apellido}`
          }));
        })
      );
  }


  // Funcion para activar o desactivar conductor (Colegio)

  async changeStateDriver(conductorId: string, colegioId: string) {
    this.getUserData(conductorId).subscribe(
      data => {
        if (data && data.activado == false) {
          this.fire.collection('Usuarios').doc(conductorId).update(
            {
              activado: true
            })
        }
        else {
          this.fire.collection('Usuarios').doc(conductorId).update(
            {
              activado: false
            })
        }
      })
  }


  // Query: trae el listado de conductores postulados para activar (Colegio)
  getDriverListAct(comuna: string, colegioId: string) {
    this.fire.collection('Usuarios', ref =>
      ref.where('tipoCuenta', '==', 2)
        .where('comuna', '==', comuna)
        .where('colegio', '==', colegioId)
    ).valueChanges().subscribe(data => {
      return data
    });

  }

 // Postular a colegio (Boton para seleccionar el colegio / Conductor ) 
 // REVISAR SI ACTUALIZA SI NO CAMBIAR GET POR SET
 selectSchool(conductorId:string, colegioId:string){
  this.fire.collection('Usuarios').doc(conductorId).set(
    {
      colegioId: colegioId
    })
  }

  // Query: trae el listado de conductores disponibles 
  //(activados / vista familias)

  getDriverListDisp(comuna: string, colegioId: string) {
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
  getSchoolList(): Observable<any> {
    return this.fire.collection('Usuarios', ref =>
      ref.where('tipoCuenta', '==', 3)
    ).valueChanges()
  }

  // ================ Agendado y pago =================

  async saveBill(familiaId:string, conductorId: string, nombre:string, rutFamilia:string){
    let today = new Date()
    let prox_mont = new Date(today.setMonth(today.getMonth() + 1))
    try{
      await this.fire.collection('Facturas').doc(familiaId).set({
        facturas: arrayUnion(
          this.factura = {
            proveedor: {
              nombre: 'ColeDrive',
              direccion: 'Av. SiempreViva 742',
              identificacion_fiscal: '42.297.827-3',
              telefono: '9 9565 1999',
              correo_electronico: 'coledrive@gmail.com',
            },
            cliente : {
              nombre:nombre,
              identificacion_fiscal: rutFamilia,
            },
            factura : {
              fecha_emision: today,
              fecha_vencimiento: prox_mont
            },
            descripcion: 'Pago servicio de transporte escolar.',
            total: 'Por definir'
          }
        )}, {merge:true});
      
      console.log("Factura guardada")
      }
      catch(error){
        console.log("ERROR: ", error)
      }
  }
  
  
  async scheduleService(familiaId:string, conductorId: string, hijo:string){
    try{
    await this.fire.collection('Agenda').doc(conductorId).set({
      viajes: arrayUnion({
        familiaId: familiaId,
        hijo: hijo
      })}, {merge:true});
    
    console.log("Viaje a agregado a conductor: ", conductorId)
    }
    catch(error){
      console.log("ERROR: ", error)
    }
  }

  // Retorna el [] de viajes de un conductor
  // ESTRUCTURA [{familiaId,hijo}]
  getSchedule(conductorId: string){
    this.fire.collection('Agenda').doc(conductorId)
      .valueChanges().subscribe(data => {
        console.log(data)
        return data
      });
  }


  updateVal(conductorId:string){
    
  }


}
  

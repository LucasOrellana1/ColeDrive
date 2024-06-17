import { Injectable, inject } from '@angular/core';
import { Firestore, arrayUnion } from '@angular/fire/firestore';
import { CollectionReference, addDoc, collection, doc, getDoc, setDoc, updateDoc, where } from 'firebase/firestore';
import { Observable, finalize, firstValueFrom, from, map, switchMap, take } from 'rxjs';
import { Colegio, Conductor, Familia, FacturaServicios, CentroPadres } from './user.interface';

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
  // ================== Fecha ========================
  date = new Date();
  day = this.date.getDate().toString().padStart(2, '0');
  month = (this.date.getMonth() + 1).toString().padStart(2, '0');
  proxmonth = (this.date.getMonth() + 2).toString().padStart(2, '0');
  year = this.date.getFullYear();
  formattedDate = `${this.day}/${ this.month}/${this.year}`; 
  formattedDate_nextMonth = `${this.day}/${this.proxmonth}/${this.year}`; 

// Simplificación en una sola funcion y tabla usuarios
  createUser(
    data: Familia | Colegio | Conductor | CentroPadres,
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


  getCurrentUserId(){
    return this.auth.authState.pipe(
      map(user => {
        if (user) {
          return user.uid; // Devuelve el UID del usuario
        } else {
          return null; // El usuario no está autenticado
        }
      })
  )}


  //  Funciones de obtención de datos de usuario
  getUserData(uid: string): Observable<any> {
    return this.fire.collection('Usuarios').doc(uid).valueChanges().pipe(take(1));
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
    return this.getUserData(conductorId).subscribe(
      data => {
        if (data && data.activado == false) {
          this.fire.collection('Usuarios').doc(conductorId).update(
            {
              activado: true,
              colegioId: colegioId
            })
        }
        else {
          this.fire.collection('Usuarios').doc(conductorId).update(
            {
              activado: false,
              colegioId: null
            })
        }
      })
  }


  // Query: trae el listado de conductores para activar (Centro de padres / Por activar)
  getDriverListAct():Observable<any[]> {
    return this.fire.collection('Usuarios', ref =>
      ref.where('tipoCuenta', '==', 2).where('activado', '==', false )
    ).snapshotChanges()
    .pipe(
      map(actions => {
        return actions.map(snapshot =>
          {
            const id = snapshot.payload.doc.id;
            const data = snapshot.payload.doc.data();
           
            return { id, data }
          }
        )
      })
    )
  }


  //Query: trae el listado de conductores para desactivar (Centro de padres / Para desactivar)
  //Le entregas el colegio del centro de padres y te traera todos los que tienen ya activados, con el objetivo de desactivarlos
  getDriverListDesc(colegio: string):Observable<any[]>{
    return this.fire.collection('Usuarios', ref =>
      ref.where('tipoCuenta', '==', 2).where('activado', '==', true).where('colegioId', '==', colegio)
    ).snapshotChanges()
    .pipe(
      map(actions => {
        return actions.map(snapshot =>
          {
            const id = snapshot.payload.doc.id;
            const data = snapshot.payload.doc.data();
           
            return { id, data }
          }
        )
      })
    )
  }


  // Query: Observable de conductores validos de conductores disponibles 
  //(activados / vista familias)

  getDriverListDisp(comuna: string, colegioId: string): Observable<any[]> {
    return this.fire.collection('Usuarios', ref =>
      ref.where('tipoCuenta', '==', 2)
        .where('comuna', '==', comuna)
        .where('activado', '==', true)
    ).valueChanges();
  }

  

  


  // ================ Agendado y pago =================

  getLenght(familiaId:string){
    const field = 'facturas' 
    return this.fire.collection('Facturas').doc(familiaId).valueChanges().pipe(
      map(
        doc => {
          if (doc && doc[field]){
            return doc[field].length;
          }
          else{
            return 0;
          }
          })
    )
  }

  async saveBill(familiaId:string, conductor: Conductor, nombre:string, rutFamilia:string){
    try{
   
      let numFactura = await firstValueFrom(this.getLenght(familiaId))

      console.log(numFactura)

      await this.fire.collection('Facturas').doc(familiaId).set({
        facturas: arrayUnion(
          this.factura = {
            proveedor: {
              nombre: conductor.nombre,
              identificacion_fiscal: conductor.rut,
              telefono: conductor.telefono,
              correo_electronico: conductor.email,
            },
            cliente : {
              nombre:nombre,
              identificacion_fiscal: rutFamilia,
            },
            factura : {
              fecha_emision: this.formattedDate,
              fecha_vencimiento: this.formattedDate_nextMonth
            },
            numFactura: numFactura,
            descripcion: 'Pago servicio de transporte escolar.',
            total: 'Por definir'
          }
        )}, {merge:true});

      this.fire.collection('Usuarios').doc(familiaId)

      console.log("Factura guardada")
      }
      catch(error){
        console.log("ERROR: ", error)
      }
  }
  
  // Devuelve observable facturas array de cuentas:
  getBills(FamiliaId: string){
    return this.fire.collection('Facturas').doc(FamiliaId).valueChanges()
  }





  
  async scheduleService(familiaId:string, conductorId: string, hijo:string, fecha: string){
    try{
      // Comprobacion agendado capacidad del vehiculo
      let viajes =  {
        [fecha] : { 
          nombre: hijo
          
      }}
      console.log(viajes);

      await this.fire.collection('Agenda').doc(conductorId).set({
        viajes}, { merge: true})
      
        console.log("Viaje a agregado a conductor: ", conductorId)
    }
    catch(error){
      console.log("ERROR: ", error)
    }
  }

  // Retorna el observable de viajes de un conductor
  getSchedule(conductorId: string):Observable<any>{
    return this.fire.collection('Agenda').doc(conductorId)
      .valueChanges()
    };
  

  async addComments(conductorId:string, familiaNombre: string, comentario:string, puntuacion: number,){
    
    this.fire.collection('Usuarios').doc(conductorId).set({
      comentarios: arrayUnion({
        Nombre: familiaNombre,
        Comentario: comentario,
        Estrellas: puntuacion,
        Fecha: this.formattedDate
      })
    }, {merge:true})
    console.log("Comentario añadido")
  }
  
  // Devuelve observable del listado de comentarios.
  getComments(conductorId: string){
    return this.fire.collection('Usuarios').doc(conductorId).valueChanges().pipe(
      map((conductor: any) => 
        conductor ? conductor.comentarios : null
    )
    );
  }

  // Devuelve listado de conductores que se hayan contratado

  /* getHiredDrivers(familiaId: string){
    return this.getBills(familiaId).pipe(
      map((b) )
    )
  }
 */
    
}


  

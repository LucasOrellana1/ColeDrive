import { Injectable, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { CollectionReference, addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { Observable, finalize, from } from 'rxjs';
import { Conductor } from './user.interface';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  firestore = inject(Firestore)

  async createFamily(rut :string, fNames: string, lNames: string, 
    telefono: string, hijos: {[key: string]: any})
    {
      //Crea la referencia a la colección familias de FB (tabla)
      const familyCollection = collection(this.firestore,'Familias');
      const newFamily = {
        Rut : rut,
        Nombres: fNames,
        Apellidos: lNames,
        Telefono: telefono,
        Hijos : hijos 
      }
    
      //Creo referencia a una familia especifica, de manera que se cree o reemplaze.
      const myDocRef = doc(familyCollection, rut)
      await setDoc(myDocRef, newFamily);
      
      console.log('Nueva familia agregada con rut: ', rut)
    }

  async createDriver(datosConductor: Conductor)
    
    {
      //Crea la referencia a la colección familias de FB (tabla)
      const driverCollection = collection(this.firestore,'Conductores');

      const newDriver = {
        Rut: datosConductor.rutConductor,
        Nombre: datosConductor.nombreConductor,
        Apellido: datosConductor.apellidoConductor,
        Email: datosConductor.emailConductor,
        
        PatenteVehiculo: datosConductor.patenteVehiculo,
        marcaVehiculo: datosConductor.marcaVehiculo,
        nombreAsistente: datosConductor.nombreAsistente,
        apellidoAsistente: datosConductor.apellidoAsistente,
        rutAsistente: datosConductor.rutAsistente,
      };

      //Creo referencia a un conductor especifica, de manera que se cree o reemplaze.
      const myDocRef = doc(driverCollection, datosConductor.rutConductor)
      const newDocRef = await setDoc(myDocRef, newDriver);
      
      console.log('New driver added with ID' , datosConductor.rutConductor)
    }

}

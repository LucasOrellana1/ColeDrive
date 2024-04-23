import { Injectable, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { CollectionReference, addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { Observable, finalize, from } from 'rxjs';

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

    async createDriver(rut :string, fNames: string, lNames: string, 
      bDate: Date, aux: {[key: string]: any}, documents: File[])
      
      {
        //Crea la referencia a la colección familias de FB (tabla)
        const driverCollection = collection(this.firestore,'Conductores');
        

        const newDriver = {
          Rut: rut,
          Nombre: fNames,
          Apellido: lNames,
          Nacimiento: bDate,
          //documents: uploadedDocumentsUrls,
          aux
        };
  
        //Creo referencia a una familia especifica, de manera que se cree o reemplaze.
        const myDocRef = doc(driverCollection, rut)
        const newDocRef = await setDoc(myDocRef, newDriver);
        
        console.log('New driver added with ID' , rut)
      }

}

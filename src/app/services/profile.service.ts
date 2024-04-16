import { Injectable, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { CollectionReference, addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { Observable, finalize, from } from 'rxjs';
import { Storage, getDownloadURL, ref, uploadBytesResumable } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  firestore = inject(Firestore)
  fStorage = inject(Storage)

  async createFamily(rut :string, fNames: string, lNames: string, 
    bDate: Date, childs: {[key: string]: any})
    
    {
      //Crea la referencia a la colección familias de FB (tabla)
      const familyCollection = collection(this.firestore,'Familias');
      const newFamily = {
        Rut : rut,
        Nombres: fNames,
        Apellidos: lNames,
        Nacimiento: bDate,
        childs 
      }

      //Creo referencia a una familia especifica, de manera que se cree o reemplaze.
      const myDocRef = doc(familyCollection, rut)
      const newDocRef = await setDoc(myDocRef, newFamily);
      
      console.log('New document added with ID' , rut)
    }

    async createDriver(rut :string, fNames: string, lNames: string, 
      bDate: Date, aux: {[key: string]: any}, documents: File[])
      
      {
        //Crea la referencia a la colección familias de FB (tabla)
        const driverCollection = collection(this.firestore,'Conductores');
        
        //Se encarga de interactuar con FB storage para guardar los documentos.
        /*
        const uploadedDocumentsUrls = await Promise.all(
          documents.map(async (document) => {
            const filePath = `Conductores/${rut}/${document.name}`;
            const fileRef = ref(this.fStorage, filePath);
            const uploadTask = uploadBytesResumable(fileRef, document);
      
            // Esperar a que se complete la carga del documento y obtener su URL de descarga
            return uploadTask.snapshotChanges().pipe(
              finalize(async () => {
                const downloadUrl = await getDownloadURL(fileRef).toPromise();
                return { name: document.name, url: downloadUrl };
              })
            ).toPromise();
          })
        );
        */

        const newDriver = {
          Rut: rut,
          Nombres: fNames,
          Apellidos: lNames,
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

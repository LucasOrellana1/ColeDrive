import { Injectable, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { CollectionReference, addDoc, collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { Observable, finalize, from } from 'rxjs';
import { Conductor } from './user.interface';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  firestore = inject(Firestore)

  //FUNCIONES RELACIONADAS A FAMILIAS:
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
        Hijos : hijos, 
        tipoCuenta: 1
      }
    
      //Creo referencia a una familia especifica, de manera que se cree o reemplaze.
      const myDocRef = doc(familyCollection, rut)
      await setDoc(myDocRef, newFamily);
      
      console.log('Nueva familia agregada con rut: ', rut)
    }


  // FUNCIONES RELACIONADAS A CONDUCTORES  
  async createDriver(cData: Conductor, id: string)
    {
      //Crea la referencia a la colección familias de FB (tabla)
      const driverCollection = collection(this.firestore,'Conductores');

      const newDriver = {
        //Datos generales
        Rut: cData.rutConductor,
        Nombre: cData.nombreConductor,
        Apellido: cData.apellidoConductor,
        Email: cData.emailConductor,
        
        PatenteVehiculo: cData.patenteVehiculo,
        marcaVehiculo: cData.marcaVehiculo,
        nombreAsistente: cData.nombreAsistente,
        apellidoAsistente: cData.apellidoAsistente,
        rutAsistente: cData.rutAsistente,
        
        // Datos para validacion por parte de colegio
        activado: false,
        colegioId: null,

        //Valor utilizado para establecer el GUARD
        tipoCuenta : 2

      };

      //Creo referencia a un conductor especifica, de manera que se cree o reemplaze.
      const myDocRef = doc(driverCollection, id)
      const newDocRef = await setDoc(myDocRef, newDriver);
      
      console.log('Nuevo conductor añadido con ID' , id)
    }

    //FUNCIONES RELACIONADAS A COLEGIOS:
    
    async activateDriver(conductorId: string, colegioId: string){

      //Se cre ala referencia al documento especifico:
      const driverRef = doc(this.firestore, "Conductores", conductorId)
      const docSnaphot = await getDoc(driverRef);
      const data = docSnaphot.data()
      
       if (docSnaphot.exists() && data["activado"] === false) {
        console.log("Document data:", docSnaphot.data());
        //Se actualizan los cambios relacionados a la validación
          await setDoc(driverRef, 
            { 
              activado: true,
              colegioId: colegioId
            })
        }  
        else{
          await setDoc(driverRef, 
            { 
              activado: false,
              colegioId: null
          })
        }
      }
        







}

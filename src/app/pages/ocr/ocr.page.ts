import { Component } from '@angular/core';
import { createWorker, Worker } from 'tesseract.js';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { validateRut, cleanRut } from 'rutlib';
@Component({
  selector: 'app-ocr',
  templateUrl: './ocr.page.html',
  styleUrls: ['./ocr.page.scss'],
})
export class OcrPage {
  worker: Worker;

  constructor() {
    this.loadWorker();
  }

  async loadWorker() {
    this.worker = await createWorker("spa");
    console.log('Worker cargado');
  }


  async recognizeImageCarnet() {
    if (!this.worker) {
      console.error("Worker aun no está cargado");
      return;
    }

    try {
      const photo: Photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      });

      // Convert the photo to a blob
      const response = await fetch(photo.webPath!);
      const blob = await response.blob();

      // Recognize the image
      const ret = await this.worker.recognize(blob);
      console.log(ret.data.text);

      // Extract RUTs from the recognized text using regular expressions
      const rutRegex = /(\d{1,2}\.\d{3}\.\d{3}-[0-9Kk])/g;
      const numDocRegex = /(\d{3}\.\d{3}\.\d{3})/g;
      const nameRegex = /\n([A-ZÁÉÍÓÚÜ\s-]+(?:\n[A-ZÁÉÍÓÚÜ\s-]+)*)(?=\n)/g;

      const extractedRuts = ret.data.text.match(rutRegex);
      const numDocumento = ret.data.text.match(numDocRegex);
      const extractedNames = ret.data.text.match(nameRegex);

      if (extractedRuts) {
        const rutLimpio = cleanRut(JSON.stringify(extractedRuts));
        const valido = validateRut(rutLimpio);
        const rutFormateado = rutLimpio.slice(0, -1) + '-' + rutLimpio.slice(-1);
        if(valido === true){
          console.log("RUT Detectado:", rutFormateado, "\nAgregado a Storage.");
          localStorage.setItem('RutCarnet', JSON.stringify(rutFormateado));
          const getRutCarnet = JSON.parse(localStorage.getItem('RutCarnet'));
        } else{
          console.log("RUT Detectado no es valido:", rutFormateado);
        }
      } else {
        console.log("No se detectaron Ruts");
      };

      if (numDocumento) {
        console.log("NumDoc Detectado:", numDocumento, "\nAgregado a Storage.");
        localStorage.setItem('NumDocCarnet', JSON.stringify(numDocumento));
        const getNumDocCarnet = JSON.parse(localStorage.getItem('NumDocCarnet'));
      }else {
        console.log("No se detectaron NumDocs");
      };

      if (extractedNames) {
        const cleanedNames = extractedNames.map(name =>
          name.replace(
            /^(\n+)|(\n{2,}.*)|(\n)/g,
            (match, p1, p2, p3) =>
              p1 ? '' : p2 ? '' : ' '
          )
        );
        console.log("Nombres Detectados:", cleanedNames, "\nAgregado a Storage.");
        localStorage.setItem('NombresCarnet', JSON.stringify(cleanedNames));
        const getNombresDocCarnet = JSON.parse(localStorage.getItem('NombresCarnet'));
      }else {
        console.log("No se detectaron Nombres");
      };
    } catch (error) {
      console.error("Error al reconocer:", error);
    } finally {
      if (this.worker) {
        await this.worker.terminate();
        console.log('Worker terminado');
        console.log('--');
        this.loadWorker();
      }
    };
  };

  // selectedFile: File;

  // seleccionarPDF(event: any) {
  //   this.selectedFile = event.target.files[0]; // Store the selected file in the selectedFile property
  // }

  // async recognizePdf(selectedFile) {
  //   if (!this.worker) {
  //     console.error("Worker not loaded");
  //     return;
  //   }

  //   try {
  //     const ret = await this.worker.recognize(selectedFile);
  //     console.log(ret.data.text);
  //   } catch (error) {
  //     console.error("Error recognizing PDF:", error);
  //   } finally {
  //     if (this.worker) {
  //       await this.worker.terminate();
  //       console.log('Worker terminated');
  //       console.log('--');
  //       this.loadWorker();
  //     }
  //   }
  // }
}
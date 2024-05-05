import { Component } from '@angular/core';
import { createWorker, Worker } from 'tesseract.js';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
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


  async recognizeImage() {
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
      const nameRegex = /\b[A-Z][a-z]+(?: [A-Z][a-z]+)?\b/g;

      const extractedRuts = ret.data.text.match(rutRegex);
      const numDocumento = ret.data.text.match(numDocRegex);
      const extractedNames = ret.data.text.match(nameRegex);

      if (extractedRuts) {
        console.log("RUT Detectado:", extractedRuts);

      } else {
        console.log("No se detectaron Ruts");
      }

      if (numDocumento) {
        console.log("NumDoc Detectado:", numDocumento);
      } else {
        console.log("No se detectaron NumDocs");
      }

      if (extractedNames) {
        console.log("Nombres Detectados:", extractedNames);

      } else {
        console.log("No se detectaron Nombres");
      }

    } catch (error) {
      console.error("Error al reconocer:", error);

    } finally {
      if (this.worker) {
        await this.worker.terminate();
        console.log('Worker terminado');
        console.log('--');
        this.loadWorker();
      }
    }
  }

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
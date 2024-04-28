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
      const extractedRuts = ret.data.text.match(rutRegex);

      if (extractedRuts) {
        console.log("Extracted RUTs:", extractedRuts);

      } else {
        console.log("No RUTs found in the recognized text");
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
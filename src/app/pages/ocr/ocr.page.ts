import { Component } from '@angular/core';
import { createWorker, Worker } from 'tesseract.js';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { ModalController } from '@ionic/angular';
import { ResultadoScanComponent } from 'src/app/shared/components/resultado-scan/resultado-scan.component';
import { validateRut, cleanRut } from 'rutlib';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-ocr',
  templateUrl: './ocr.page.html',
  styleUrls: ['./ocr.page.scss'],
})
export class OcrPage {
  worker: Worker;

  constructor(private modalController: ModalController) {
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

      const response = await fetch(photo.webPath!);
      const blob = await response.blob();

      const ret = await this.worker.recognize(blob);
      console.log(ret.data.text);

      // Extract detected values
      const rutRegex = /(\d{1,2}\.\d{3}\.\d{3}-[0-9Kk])/g;
      const numDocRegex = /(\d{3}\.\d{3}\.\d{3})/g;
      const nameRegex = /\n([A-ZÁÉÍÓÚÜ\s-]+(?:\n[A-ZÁÉÍÓÚÜ\s-]+)*)(?=\n)/g;

      const extractedRuts = ret.data.text.match(rutRegex);
      const numDocumento = ret.data.text.match(numDocRegex);
      const extractedNames = ret.data.text.match(nameRegex);

      let rutFormateado = '';
      if (extractedRuts) {
        const rutLimpio = cleanRut(JSON.stringify(extractedRuts));
        const valido = validateRut(rutLimpio);
        rutFormateado = rutLimpio.slice(0, -1) + '-' + rutLimpio.slice(-1);
        if (valido) {
          console.log("RUT Detectado:", rutFormateado, "\nAgregado a Storage.");
          localStorage.setItem('RutCarnet', (rutFormateado));
        } else {
          console.log("RUT Detectado no es valido:", rutFormateado);
        }
      } else {
        console.log("No se detectaron Ruts");
      }

      if (numDocumento) {
        console.log("NumDoc Detectado:", numDocumento, "\nAgregado a Storage.");
        localStorage.setItem('NumDocCarnet', JSON.stringify(numDocumento));
      } else {
        console.log("No se detectaron NumDocs");
      };

      let cleanedNames: string[] = [];
      if (extractedNames) {
        cleanedNames = extractedNames.map(name =>
          name.replace(
            /^(\n+)|(\n{2,}.*)|(\n)/g,
            (match, p1, p2, p3) =>
              p1 ? '' : p2 ? '' : ' '
          )
        );
        console.log("Nombres Detectados:", cleanedNames, "\nAgregado a Storage.");
        localStorage.setItem('NombresCarnet', JSON.stringify(cleanedNames));
      } else {
        console.log("No se detectaron Nombres");
      }

      await this.presentModal(rutFormateado, numDocumento, cleanedNames);
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

  async presentModal(rut: string, numDoc: string[], names: string[]) {
    const modal = await this.modalController.create({
      component: ResultadoScanComponent,
      componentProps: {
        rut: rut ? rut : 'No encontrado',
        numDoc: numDoc && numDoc.length > 0 ? numDoc[0] : 'No encontrado',
        names: names ? names : 'No encontrado',
      }
    });
    return await modal.present();
  }
}

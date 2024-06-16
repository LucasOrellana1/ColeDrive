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

      // Extraer valores
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

  // OCR ANTECEDENTES
  async recognizeImage(scenario: 'Conductor' | 'Asistente') { //Definir escenarios
    if (!this.worker) {
      console.error("Worker aún no está cargado");
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

      // Extraer Valor Folio
      const folioRegex = /FOLIO\s*:\s*(\d+)/i;
      const folioMatch = ret.data.text.match(folioRegex);
      let folioNumber = '';

      // Guardar valor
      if (folioMatch && folioMatch.length > 1) {
        folioNumber = folioMatch[1];
        console.log(`Numero de folio: ${folioNumber}`);
        localStorage.setItem(`FolioAnte${scenario}`, JSON.stringify(folioNumber));
      } else {
        console.log('No se detectó numero de folio.');
        localStorage.setItem(`FolioAnte${scenario}`, JSON.stringify('0'));
      }

      // Extraer Valor antecedentes
      const frase = "SIN ANTECEDENTES";
      const phraseFound = ret.data.text.includes(frase);

      // Guardar valor
      if (phraseFound) {
        console.log("Sin antecedentes.");
        localStorage.setItem(`Antecedentes${scenario}`, JSON.stringify('sin'));
      } else {
        console.log("Antecedentes encontrados.");
        localStorage.setItem(`Antecedentes${scenario}`, JSON.stringify('con'));
      }

      // Call Modal según escenario
      if (scenario === 'Conductor') {
        await this.presentModalAnte(frase, folioNumber);
      } else if (scenario === 'Asistente') {
        await this.presentModalAnte2(frase, folioNumber);
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

  // OCER LICENCIA
  async recognizeImageLicencia() {
    if (!this.worker) {
      console.error("Worker aún no está cargado");
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

      // Extraer valor "A3" o mayor
      const licenciaRegex = /A[3-5]/i;
      const licenciaMatch = ret.data.text.match(licenciaRegex);
      let licenciaType = '';

      // Guardar valor
      if (licenciaMatch && licenciaMatch.length > 0) {
        licenciaType = licenciaMatch[0];
        console.log(`Tipo de licencia detectada: ${licenciaType}`);
        localStorage.setItem('TipoLicencia', JSON.stringify(licenciaType));
      } else {
        console.log('No se detectó tipo de licencia.');
        localStorage.setItem('TipoLicencia', JSON.stringify('No detectada'));
      }

      // Call modal presentacion
      await this.presentModalLicencia(licenciaType);

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

  // Modal presentacion info carnet
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

  // Modal presentacion info Antecedentes Conductor
  async presentModalAnte(antecedentes: string, folioAnte: string) {
    const modal = await this.modalController.create({
      component: ResultadoScanComponent,
      componentProps: {
        antecedentes: antecedentes ? antecedentes : 'No encontrado',
        folioAnte: folioAnte ? folioAnte : 'No encontrado',
      }
    });
    return await modal.present();
  }

  // Modal presentacion info Antecedentes Asistente
  async presentModalAnte2(antecedentes2: string, folioAnte2: string) {
    const modal = await this.modalController.create({
      component: ResultadoScanComponent,
      componentProps: {
        antecedentes2: antecedentes2 ? antecedentes2 : 'No encontrado',
        folioAnte2: folioAnte2 ? folioAnte2 : 'No encontrado',
      }
    });
    return await modal.present();
  }

  // Modal presentacion info Licencia
  async presentModalLicencia(licenciaType: string) {
    const modal = await this.modalController.create({
      component: ResultadoScanComponent,
      componentProps: {
        licenciaType: licenciaType ? licenciaType : 'No encontrado',
      }
    });
    return await modal.present();
  }
}

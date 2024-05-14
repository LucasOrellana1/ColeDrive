import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray,
  AbstractControlOptions
} from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { OcrPage } from '../ocr/ocr.page';
import { RequestAPIService } from 'src/app/services/requestAPI.service';

@Component({
  selector: 'app-formulario-conductor',
  templateUrl: './formulario-conductor.page.html',
  styleUrls: ['./formulario-conductor.page.scss'],

})
export class FormularioConductorPage {

  constructor(private fb: FormBuilder, private alertController: AlertController, private ocr: OcrPage, private RequestApi: RequestAPIService) { }

  // Inicialización directa de formularioRegistro en la declaración
  formularioRegistro: FormGroup = this.fb.group({
    nombreConductor: ['', Validators.required],
    apellidoConductor: ['', Validators.required],
    rutConductor: ['', Validators.required],
    emailConductor: ['a@a.a', [Validators.required, Validators.email]],
    passwordConductor: ['111222', [Validators.required, Validators.minLength(6)]],
    confirmPasswordConductor: ['111222', Validators.required],
    patenteVehiculo: ['', Validators.required],
    marcaVehiculo: ['', Validators.required],
    nombreAsistente: ['', Validators.required],
    apellidoAsistente: ['', Validators.required],
    rutAsistente: ['', Validators.required]
  }, { validators: this.passwordMatchValidator } as AbstractControlOptions);

  passwordMatchValidator(frm: FormGroup) {
    return frm.controls['passwordConductor'].value === frm.controls['confirmPasswordConductor'].value ? null : { 'mismatch': true };
  };

  async guardar() {
    var f = this.formularioRegistro.value;

    if (this.formularioRegistro.invalid) {
      const alert = await this.alertController.create({
        header: 'Datos Incompletos',
        message: 'Debes completar todos los campos requeridos.',
        buttons: ['Aceptar']
      });
      await alert.present();
      console.log(this.formularioRegistro.value)
      console.log('Form Valid:', this.formularioRegistro.valid);
      console.log('Form Errors:', this.formularioRegistro.errors);
      return;
    }

    var datosConductor = {
      rutConductor: f.rutConductor,
      nombreConductor: f.nombreConductor,
      apellidoConductor: f.apellidoConductor,
      emailConductor: f.emailConductor,
      patenteVehiculo: f.patenteVehiculo,
      marcaVehiculo: f.marcaVehiculo,
      nombreAsistente: f.nombreAsistente,
      apellidoAsistente: f.apellidoAsistente,
      rutAsistente: f.rutAsistente,
    };

    localStorage.setItem('datosConductor', JSON.stringify(datosConductor));
    await this.validar(f.patenteVehiculo);

    if (localStorage.getItem('datosConductor.patente') === localStorage.getItem('RespuestaApi.Patente') &&
      localStorage.getItem('datosConductor.marca') === localStorage.getItem('RespuestaApi.Marca')) {
      console.log("patente y marca validadas")
    };

    this.formularioRegistro.reset();

    const successAlert = await this.alertController.create({
      header: 'Registro Exitoso',
      message: 'El conductor ha sido registrado correctamente.',
      buttons: ['Aceptar']
    });
    await successAlert.present();
  };

  async scanCarnet() {
    await this.ocr.recognizeImageCarnet(); // Call the method from the injected service
  };

  async validar(patente: string): Promise<boolean> {
    this.RequestApi.buscarPatente(patente).subscribe(
      (resultado) => {
        console.log(resultado);
        const patenteResponse = resultado.Patente;
        // quitar todo despues del -
        const patenteFormateada = patenteResponse.replace(/-\d+$/, "");
        localStorage.setItem('RespuestaApi', JSON.stringify({ ...resultado, Patente: patenteFormateada }));
        return true;
      },
      (error) => {
        console.error('Error al buscar la patente:', error);
        return false;
        // Handle errors
      }
    );
    return false;
  };
}
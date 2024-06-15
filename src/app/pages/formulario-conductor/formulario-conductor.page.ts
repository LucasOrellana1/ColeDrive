import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  AbstractControlOptions
} from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { OcrPage } from '../ocr/ocr.page';
import { RequestAPIService } from 'src/app/services/requestAPI.service';
import { ProfileService } from 'src/app/services/profile.service';
import { Conductor } from 'src/app/services/user.interface';
import { authService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-formulario-conductor',
  templateUrl: './formulario-conductor.page.html',
  styleUrls: ['./formulario-conductor.page.scss'],
})
export class FormularioConductorPage {
  datosConductor: Conductor;

  constructor(
    private fb: FormBuilder,
    private alertController: AlertController,
    private ocr: OcrPage,
    private RequestApi: RequestAPIService,
    private profService: ProfileService,
    private auth: authService
  ) {

  }

  //--------------------------------------------------------------------------------------------------------------------------//
  validarRut(rut: string): boolean {
    const rutSinGuion = rut.replace("-", "");
    const rutSinDigitoVerificador = rutSinGuion.slice(0, -1);
    const digitoVerificador = rutSinGuion.slice(-1).toUpperCase();
    let factor = 2;
    let suma = 0;

    for (let i = rutSinDigitoVerificador.length - 1; i >= 0; i--) {
      suma += factor * parseInt(rutSinDigitoVerificador[i]);
      factor = factor === 7 ? 2 : factor + 1;
    }

    let digitoCalculado: string | number = 11 - (suma % 11);
    if (digitoCalculado === 11) {
      digitoCalculado = "0";
    } else if (digitoCalculado === 10) {
      digitoCalculado = "K";
    } else {
      digitoCalculado = digitoCalculado.toString();
    }

    return digitoCalculado === digitoVerificador;
  }

  formatRut(rut: string): string {
    const cleanedRut = rut.replace(/[^\dkK]/g, '').slice(0, 9);

    if (cleanedRut.length > 1) {
      const formattedRut = cleanedRut.slice(0, cleanedRut.length - 1) + '-' + cleanedRut.slice(-1);
      return formattedRut;
    }

    return cleanedRut;
  }

  rutValidator = (control: FormControl) => {
    const rut = control.value;
    const regex = /^[0-9]{8}-[0-9kK]$/i; // Regex for 8 digits, a dash '-', and then another digit

    if (!regex.test(rut)) {
      return { invalidRut: true };
    }

    return this.validarRut(rut) ? null : { invalidRut: true };
  }

  //--------------------------------------------------------------------------------------------------------------------------//
  patenteValidator(control: FormControl) {
    const patente = control.value ? control.value.toUpperCase() : '';
    const patenteRegex = /^([A-Z]{4}[0-9]{2}|[0-9]{4}[A-Z]{2})$/;

    if (!patenteRegex.test(patente)) {
      return { invalidPatente: true };
    }

    return null;
  }

  //--------------------------------------------------------------------------------------------------------------------------//
  formularioRegistro: FormGroup = this.fb.group({
    nombreConductor: ['', Validators.required],
    apellidoConductor: ['', Validators.required],
    rutConductor: ['', [Validators.required, this.rutValidator]], // Usar validador sincronico
    emailConductor: ['', [Validators.required, Validators.email]],
    passwordConductor: ['', [Validators.required, Validators.minLength(6)]],
    confirmPasswordConductor: ['', Validators.required],
    patenteVehiculo: ['', [Validators.required, this.patenteValidator]], // Usar validador sincronico
    marcaVehiculo: ['', Validators.required],
    nombreAsistente: ['', Validators.required],
    apellidoAsistente: ['', Validators.required],
    rutAsistente: ['', [Validators.required, this.rutValidator]], // Usar validador sincronico
    comuna: ['', Validators.required], // Nuevo campo comuna
    telefonoConductor: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
  }, { validators: this.passwordMatchValidator } as AbstractControlOptions);

  passwordMatchValidator(frm: FormGroup) {
    return frm.controls['passwordConductor'].value === frm.controls['confirmPasswordConductor'].value ? null : { mismatch: true };
  };

  //--------------------------------------------------------------------------------------------------------------------------//
  async guardar() {
    var f = this.formularioRegistro.value;

    this.datosConductor = {
      rut: f.rutConductor,
      nombre: f.nombreConductor,
      apellido: f.apellidoConductor,
      email: f.emailConductor,
      telefono: f.telefonoConductor,
      patenteVehiculo: f.patenteVehiculo,
      marcaVehiculo: f.marcaVehiculo,
      asistente: {
        nombre: f.nombreAsistente,
        rut: f.rutAsistente,
      },
      comuna: f.comuna,
      ciudad: ''
    };

    if (this.formularioRegistro.invalid) {
      this.formularioRegistro.markAllAsTouched(); // Mark all form controls as touched
      const alert = await this.presentAlert('Datos Incompletos', 'Debes completar todos los campos requeridos.');
      await alert.present();
      console.log("--- TA MALO XAO PESCAO ---");
      console.log(this.formularioRegistro.value);
      console.log('Form Valid:', this.formularioRegistro.valid);
      console.log('Form Errors:', this.formularioRegistro.errors);
      return;
    };

    localStorage.setItem('datosConductor', JSON.stringify(this.datosConductor));

    const valorApi = await this.invocarApi(f.patenteVehiculo);

    if (valorApi === true) {

      if (localStorage.getItem('datosConductor.patente') === localStorage.getItem('RespuestaApi.Patente') &&
        localStorage.getItem('datosConductor.marca') === localStorage.getItem('RespuestaApi.Marca') &&
        localStorage.getItem('datosConductor.rutConductor') === localStorage.getItem('RespuestaApi.RUT') ||
        localStorage.getItem('RespuestaApi.RUT') === localStorage.getItem('RutCarnet')) {
        console.log("--- VALORES VALIDADOS ---")
        // Llmama funcion para crear conductor en DB.

        try {
          await this.auth.registerDriver(this.datosConductor,
            f.passwordConductor)

          console.log("TODO GUARDADO EN ORDEN")
          const successAlert = await this.presentAlert('Registro Exitoso', 'El conductor ha sido registrado correctamente.');
          await successAlert.present();
          this.formularioRegistro.reset();

        } catch {
          console.log("--- TA MALO XAO PESCAO ---")
          const errorAlert = await this.presentAlert('Error de Registro', 'Hubo un error durante el registro.');
          await errorAlert.present();
        }

      } else {
        const errorAlert = await this.presentAlert('Error de Registro', 'Hubo un error durante el registro.');
        await errorAlert.present();
        console.log("--- TA MALO XAO PESCAO ---")
      };
    } else {
      const errorAlert = await this.presentAlert('Error en request', 'La API retorna falso');
      await errorAlert.present();
      console.log("--- TA MALO XAO PESCAO ---")
    };
    this.formularioRegistro.reset();

  };

  async scanCarnet() {
    await this.ocr.recognizeImageCarnet(); // Call the method from the injected service >:C
    const nombresCarnet = localStorage.getItem('NombresCarnet');
    const nombresArray = nombresCarnet ? JSON.parse(nombresCarnet) : [];
    const nombreConductorExtraido = nombresArray.length > 0 ? nombresArray[0] : '';

    this.formularioRegistro.patchValue({
      rutConductor: localStorage.getItem('RutCarnet') || '', // Set Rut or an empty string if not found
      nombreConductor: nombreConductorExtraido || 'error', // Set Nombre or an empty string if not found
      // Set other form fields as needed
    });
  };

  async invocarApi(patente: string): Promise<boolean> {
    try {
      const resultado = await this.RequestApi.buscarPatente(patente).toPromise();
      console.log(resultado);
      const patenteResponse = resultado.Patente;
      // quitar todo después del -
      const patenteFormateada = patenteResponse.replace(/-\d+$/, "");
      localStorage.setItem('RespuestaApi', JSON.stringify({ ...resultado, Patente: patenteFormateada }));
      return true;
    } catch (error) {
      console.error('Error al buscar la patente:', error);
      return false;
    }
  };

  async presentAlert(header: string, message: string): Promise<HTMLIonAlertElement> {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['Aceptar']
    });

    return alert;
  };
}

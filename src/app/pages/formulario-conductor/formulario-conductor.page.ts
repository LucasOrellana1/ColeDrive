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
import { ProfileService } from 'src/app/services/profile.service';
import { Conductor } from 'src/app/services/user.interface';
import { authService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-formulario-conductor',
  templateUrl: './formulario-conductor.page.html',
  styleUrls: ['./formulario-conductor.page.scss'],

})
export class FormularioConductorPage {
  datosConductor: Conductor

  constructor(
    private fb: FormBuilder,
    private alertController: AlertController,
    private ocr: OcrPage,
    private RequestApi: RequestAPIService,
    private profService: ProfileService,
    private auth: authService
  ) {

    this.datosConductor = {
      rut: '',
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      patenteVehiculo: '',
      marcaVehiculo: '',
      nombreAsistente: '',
      apellidoAsistente: '',
      rutAsistente: '',
      comuna: '', // Nuevo campo comuna
      tipoCuenta : 2

    };
  }

  // Inicialización directa de formularioRegistro en la declaración
  formularioRegistro: FormGroup = this.fb.group({
    nombreConductor: ['', Validators.required],
    apellidoConductor: ['', Validators.required],
    rutConductor: ['', Validators.required],
    emailConductor: ['', [Validators.required, Validators.email]],
    passwordConductor: ['', [Validators.required, Validators.minLength(6)]],
    confirmPasswordConductor: ['', Validators.required],
    patenteVehiculo: ['', Validators.required],
    marcaVehiculo: ['', Validators.required],
    nombreAsistente: ['', Validators.required],
    apellidoAsistente: ['', Validators.required],
    rutAsistente: ['', Validators.required],
    comuna: ['', Validators.required], // Nuevo campo comuna
    telefonoConductor: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
  }, { validators: this.passwordMatchValidator } as AbstractControlOptions);

  passwordMatchValidator(frm: FormGroup) {
    return frm.controls['passwordConductor'].value === frm.controls['confirmPasswordConductor'].value ? null : { 'mismatch': true };
  };

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
      nombreAsistente: f.nombreAsistente,
      apellidoAsistente: f.apellidoAsistente,
      rutAsistente: f.rutAsistente,
      comuna: f.comuna,
    };

    if (this.formularioRegistro.invalid) {
      const alert = await this.presentAlert('Datos Incompletos', 'Debes completar todos los campos requeridos.');
      await alert.present();
      console.log("--- TA MALO XAO PESCAO ---");
      console.log(this.formularioRegistro.value)
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
        
        try{
          await this.auth.registerDriver(this.datosConductor, 
            f.passwordConductor)
  
            console.log("TODO GUARDADO EN ORDEN")
            const successAlert = await this.presentAlert('Registro Exitoso', 'El conductor ha sido registrado correctamente.');
            await successAlert.present();
            this.formularioRegistro.reset();
  
        }
        catch{
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
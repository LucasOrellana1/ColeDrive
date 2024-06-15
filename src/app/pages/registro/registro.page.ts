import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { authService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { Colegio, Conductor, Familia, CentroPadres } from 'src/app/services/user.interface';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit{
  
 
  authService = inject(authService)
  fData: Familia
  lista1: any
  cdata: CentroPadres

  constructor(private fb: FormBuilder, 
    private alertController: AlertController,
    private auth: authService,
    private profileService : ProfileService
      ) {
    }
  
  // No quitar OnInit
  ngOnInit() {
   

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


    // Inicialización directa en la declaración
  formularioRegistro: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
    telefono: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    direccion: ['', Validators.required],
    rut: ['', Validators.required, this.rutValidator], //Campo rut agregado//
    numHijos: [0, [Validators.required, Validators.min(1)]],
    ciudad: ['', Validators.required],
    comuna: ['', Validators.required], // Nuevo campo comuna
    colegio: ['', Validators.required], // Nuevo campo colegio
    hijosArray: this.fb.array([])
  }, { validator: this.passwordMatchValidator });

 


  passwordMatchValidator(frm: FormGroup) {
    return frm.controls['password'].value === frm.controls['confirmPassword'].value ? null : {'mismatch': true};
  }

  updateHijos() {
    const numHijos = this.formularioRegistro.get('numHijos')?.value || 0;
    this.hijosArray.clear();
    for (let i = 0; i < numHijos; i++) {
      this.hijosArray.push(this.fb.group({
        nombreHijo: ['', Validators.required],
        cursoHijo: ['', Validators.required]
      }));
    }
  }

  get hijosArray(): FormArray {
    return this.formularioRegistro.get('hijosArray') as FormArray;
  }

  async Guardar() {
    if (this.formularioRegistro.invalid) {
      const alert = await this.alertController.create({
        header: 'Datos Incompletos',
        message: 'Tienes que llenar todos los datos',
        buttons: ['Aceptar']
      });
      await alert.present();
      return;
    }

    let fData = {
      nombre: this.formularioRegistro.value.nombre,
      apellido: this.formularioRegistro.value.apellido,
      email: this.formularioRegistro.value.email,
      telefono: this.formularioRegistro.value.telefono,
      direccion: this.formularioRegistro.value.direccion,
      rut: this.formularioRegistro.value.rut, //Campo Rut Agregado//
      numeroHijos: this.formularioRegistro.value.numHijos,
      hijos: this.hijosArray.value,
      ciudad: this.formularioRegistro.value.cuidad,
      comuna: this.formularioRegistro.value.comuna, // Nuevo campo comuna
         
      tipoCuenta : 1
    };

    

    let usuarioString = JSON.stringify(fData);

    localStorage.setItem('usuario', usuarioString);
    
    try{
      await this.auth.registerFamily(fData, fData.email,
        fData.nombre,
        this.formularioRegistro.value.password)

        console.log("TODO GUARDADO EN ORDEN")
        this.formularioRegistro.reset();
    }
    catch{
      console.log("--- TA MALO XAO PESCAO ---")
    }
  }

  async presentAlert(header: string, message: string): Promise<HTMLIonAlertElement> {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['Aceptar']
    });

    return alert;
  };
}
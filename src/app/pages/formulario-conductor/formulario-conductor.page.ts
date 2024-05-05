import { Component, OnInit } from '@angular/core';
import{
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray
 }from '@angular/forms';
 import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-formulario-conductor',
  templateUrl: './formulario-conductor.page.html',
  styleUrls: ['./formulario-conductor.page.scss'],
})
export class FormularioConductorPage {

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
    rutAsistente: ['', Validators.required]
  }, { validator: this.passwordMatchValidator });

  constructor(private fb: FormBuilder, private alertController: AlertController) {}



  passwordMatchValidator(frm: FormGroup) {
    return frm.controls['passwordConductor'].value === frm.controls['confirmPasswordConductor'].value ? null : { 'mismatch': true };
  }

  async guardar() {
    var f = this.formularioRegistro.value;

    if (this.formularioRegistro.invalid) {
      const alert = await this.alertController.create({
        header: 'Datos Incompletos',
        message: 'Debes completar todos los campos requeridos.',
        buttons: ['Aceptar']
      });
      await alert.present();
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
      rutAsistente: f.value.rutAsistente,
    };

    localStorage.setItem('datosConductor', JSON.stringify(datosConductor));

    this.formularioRegistro.reset();

    
    const successAlert = await this.alertController.create({
      header: 'Registro Exitoso',
      message: 'El conductor ha sido registrado correctamente.',
      buttons: ['Aceptar']
    });
    await successAlert.present();
  }
}
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { authService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage{
  
  authService = inject(authService)
  profileService = inject(ProfileService)


  // Inicialización directa en la declaración
  formularioRegistro: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
    telefono: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    direccion: ['', Validators.required],
    numHijos: [0, [Validators.required, Validators.min(1)]],
    hijosArray: this.fb.array([])
  }, { validator: this.passwordMatchValidator });

  constructor(private fb: FormBuilder, private alertController: AlertController) {}


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

    let usuarioJson = {
      nombre: this.formularioRegistro.value.nombre,
      apellido: this.formularioRegistro.value.apellido,
      email: this.formularioRegistro.value.email,
      password: this.formularioRegistro.value.password,
      telefono: this.formularioRegistro.value.telefono,
      direccion: this.formularioRegistro.value.direccion,
      numeroHijos: this.formularioRegistro.value.numHijos,
      hijos: this.hijosArray.value
    };

    let usuarioString = JSON.stringify(usuarioJson);

    localStorage.setItem('usuario', usuarioString);
    
    //Registro en firebase Auth
    try {
      await this.authService.register(usuarioJson.email, usuarioJson.nombre, usuarioJson.password)
    }
    
    catch(error){
      console.error(error)
      const alert = await this.alertController.create({
        header: 'Email invalido',
        message: 'Revisa que el email este correctamente escrito',
        buttons: ['Aceptar']
      });
      await alert.present();
      return;
    }

    //Registro de perfil firestore
    this.profileService.createFamily(usuarioJson.telefono,
      usuarioJson.nombre,
      usuarioJson.apellido,
      usuarioJson.telefono, 
      usuarioJson.hijos)

    this.formularioRegistro.reset();
    
    console.log("Guardado")
  }
}
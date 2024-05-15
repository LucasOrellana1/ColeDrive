import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { authService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { Familia } from 'src/app/services/user.interface';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage{
  
  authService = inject(authService)
  fData: Familia

  constructor(private fb: FormBuilder, 
    private alertController: AlertController,
    private auth: authService,
    private profileSerive : ProfileService
      ) {
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
    rut: ['', ], //Campo rut agregado//
    numHijos: [0, [Validators.required, Validators.min(1)]],
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
      rut: this.formularioRegistro.value.rut,//Campo Rut Agregado//
      numeroHijos: this.formularioRegistro.value.numHijos,
      hijos: this.hijosArray.value
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
}
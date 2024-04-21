import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  formularioLogin: FormGroup;

  constructor(public fb: FormBuilder, public alertController: AlertController) {
    this.formularioLogin = this.fb.group({
      correo: ['', Validators.required],  // Asegúrate de que en el HTML también esté como 'correo' para el formControlName.
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  async ingresar() {
    if (this.formularioLogin.invalid) {
      const alert = await this.alertController.create({
        header: 'Datos Incompletos',
        message: 'Debes completar todos los campos para ingresar.',
        buttons: ['Aceptar']
      });
      await alert.present();
      return;
    }

    const f = this.formularioLogin.value;
    const storedData = localStorage.getItem('usuario');
    if (storedData) {
      const usuario = JSON.parse(storedData);

      if (usuario.email === f.correo && usuario.password === f.password) {
        console.log('Ingresado');
        this.formularioLogin.reset();
        // Aquí puedes redirigir al usuario a la página principal o donde necesites
      } else {
        const alert = await this.alertController.create({
          header: 'Datos Incorrectos',
          message: 'Los datos que ingresaste son incorrectos.',
          buttons: ['Aceptar']
        });
        await alert.present();
      }
    } else {
      const alert = await this.alertController.create({
        header: 'Usuario no encontrado',
        message: 'No se encontró información de usuario. Por favor, registra una cuenta.',
        buttons: ['Aceptar']
      });
      await alert.present();

      
    }
  }
}

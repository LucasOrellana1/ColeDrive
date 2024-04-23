import { Component, OnInit, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage{

  firebaseAuth = inject(Auth);
  router =  inject(Router)

  async signOut() {
    try {
      await this.firebaseAuth.signOut();
      // Redirige a la página de inicio de sesión o a la página de bienvenida después del cierre de sesión
      this.router.navigate(['/inicio']); // Reemplaza '/login' con la ruta de tu página de inicio de sesión
    } catch (error) {
      // Maneja el error aquí
      console.error('Error al cerrar sesión:', error);
    }
  }
}


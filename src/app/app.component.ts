import { Component, OnInit } from '@angular/core';
import { ProfileService } from './services/profile.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  user$: Observable<any>; // Observable para el usuario actual
  userType: number | null = null; // Variable para almacenar el tipo de cuenta del usuario

  constructor(private profileService: ProfileService) {}

  ngOnInit() {
    this.getCurrentUser(); // Llama al método para obtener el usuario actual al inicializar el componente
  }

  getCurrentUser() {
    this.user$ = this.profileService.getCurrentUser(); // Obtén el observable del usuario actual
    this.user$.subscribe(user => {
      if (user) {
        this.userType = user.tipoCuenta; // Asigna el tipo de cuenta del usuario si está autenticado
      } else {
        this.userType = null; // Si no hay usuario autenticado, asigna null
      }
    });
  }
}



import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-valoracion',
  templateUrl: './valoracion.page.html',
  styleUrls: ['./valoracion.page.scss'],
})
export class ValoracionPage implements OnInit {

  hoveredStar: number = 0;
  ratedStar: number = 0;
  comentario: string = '';
  user$: Observable<any>;
  userData: any;

  conductorId: string;
  conductorNombre: string;
  conductorRut: string;
  conductorTelefono: string;
  conductorEmail: string;

  constructor(private profileService: ProfileService, private router: Router) { }

  resetHoveredStar() {
    this.hoveredStar = 0;
  }

  rateService(rating: number) {
    this.ratedStar = rating;
    console.log('Valoración seleccionada:', rating);
  }

  async submitRating() {
    
    if (this.conductorId && this.conductorNombre && this.comentario && this.ratedStar) {
      try {
        await this.profileService.addComments(
          this.conductorId,
          this.conductorNombre,
          this.comentario,
          this.ratedStar
        );
       
        console.log('Valoración y comentario enviados correctamente');
        this.comentario = ''; // Limpiar el comentario
        this.ratedStar = 0;   // Restablecer la valoración  // Restablecer la valoración
        this.router.navigate(['/perfil']);
        // Puedes agregar cualquier lógica adicional después de enviar la valoración y comentario
      } catch (error) {
        console.error('Error al enviar la valoración y comentario:', error);
        // Manejar el error según sea necesario
      }
    } else {
      
      console.error('Faltan datos requeridos para enviar la valoración y comentario.');
      // Puedes mostrar un mensaje de error o tomar otra acción si faltan datos
    }
  }

  ngOnInit() {
    this.user$ = this.profileService.getCurrentUser();
    this.user$.subscribe(data => {
      this.userData = data;
      console.log(this.userData);
    });

    // Recoger los datos pasados por el estado
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.conductorId = navigation.extras.state['conductorId'];
      this.conductorNombre = navigation.extras.state['conductorNombre'];
      this.conductorRut = navigation.extras.state['conductorRut'];
      this.conductorTelefono = navigation.extras.state['conductorTelefono'];
      this.conductorEmail = navigation.extras.state['conductorEmail'];
    }
  }
}

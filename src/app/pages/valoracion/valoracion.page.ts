import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-valoracion',
  templateUrl: './valoracion.page.html',
  styleUrls: ['./valoracion.page.scss'],
})
export class ValoracionPage implements OnInit {

  hoveredStar: number = 0; // Variable para controlar la estrella sobre la cual se pasa el cursor
  ratedStar: number = 0; // Variable para controlar la estrella seleccionada
  comentario: string = ''; // Variable para almacenar el comentario del usuario
  user$: Observable<any>;
  userData: any;

  constructor(private profileService: ProfileService , private router: Router) { }

  resetHoveredStar() {
    // Restablece la variable hoveredStar cuando se sale del área de las estrellas
    this.hoveredStar = 0;
  }

  rateService(rating: number) {
    // Establece la valoración seleccionada
    this.ratedStar = rating;
    // Puedes enviar la valoración al servidor aquí si lo deseas
    console.log('Valoración seleccionada:', rating);
  }

  submitRating() {
    // Implementa la lógica para enviar la valoración y el comentario al servidor aquí
  }

  ngOnInit() {
    this.user$ = this.profileService.getCurrentUser();
    this.user$.subscribe(data => {
      this.userData = data;
      console.log(this.userData);
           
    });
    
  }

}

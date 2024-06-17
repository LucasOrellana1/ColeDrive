import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-aprobados',
  templateUrl: './aprobados.component.html',
  styleUrls: ['./aprobados.component.scss'],
})

export class AprobadosComponent implements OnInit {
  conductoresList: any[] = [];
  filteredConductoresList: any[] = [];
  searchTerm: string = '';
  

  constructor(private profileService: ProfileService) { }
  
  user$: Observable<any>;
  userData: any;
  comuna: string; 
  colegioId:string;
  

  ngOnInit() {

    this.user$ = this.profileService.getCurrentUser();
    this.user$.subscribe(data => {
      this.userData = data;
      this.comuna = this.userData.comuna; // Reemplaza con la comuna deseada
      this.colegioId = this.userData.colegio; // Reemplaza con el colegioId deseado
      this.loadConductoresList();
    });


    
  }

  loadConductoresList() {
    this.profileService.getDriverListDisp(this.comuna, this.colegioId).subscribe(
      data => {
        this.conductoresList = data;
        this.filteredConductoresList = data;
      },
      error => {
        console.error('Error al obtener la lista de conductores:', error);
      }
    );
  }

  filterConductores() {
    if (!this.searchTerm) {
      this.filteredConductoresList = this.conductoresList;
    } else {
      const searchTermLower = this.searchTerm.toLowerCase();
      this.filteredConductoresList = this.conductoresList.filter(conductor =>
        conductor.nombre.toLowerCase().includes(searchTermLower) ||
        conductor.apellido.toLowerCase().includes(searchTermLower) ||
        conductor.email.toLowerCase().includes(searchTermLower) ||
        conductor.telefono.toLowerCase().includes(searchTermLower)
      );
    }
  }
}
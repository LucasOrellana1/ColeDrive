import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-no-aprobar',
  templateUrl: './no-aprobar.component.html',
  styleUrls: ['./no-aprobar.component.scss'],
})
export class NoAprobarComponent  implements OnInit {
  conductoresList: any[] = [];
  filteredConductoresList: any[] = [];
  searchTerm: string = '';
  

  constructor(private profileService: ProfileService) { }
  
  user$: Observable<any>;
  userData: any;
  
  colegioId:string;
  

  ngOnInit() {

    this.user$ = this.profileService.getCurrentUser();
    this.user$.subscribe(data => {
      this.userData = data;
      
      this.colegioId = this.userData.colegio; // Reemplaza con el colegioId deseado
      this.loadConductoresList();
    });


    
  }

  loadConductoresList() {
    this.profileService.getDriverListDesc(this.colegioId).subscribe(
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
  
  async disapproveConductor(conductor: any) {

    console.log('No Aprobado:', conductor);
    const conductorId = conductor.id;
    const colegioId = this.userData.colegio;

    try {
      await this.profileService.changeStateDriver(conductorId, colegioId);
      console.log('Estado del conductor actualizado correctamente.');

    } catch (error) {
      console.error('Error al actualizar el estado del conductor:', error);

    }
  }
}



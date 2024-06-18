import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-lista-conductores',
  templateUrl: './lista-conductores.component.html',
  styleUrls: ['./lista-conductores.component.scss'],
})
export class ListaConductoresComponent implements OnInit {
  conductoresList: any[] = [];
  filteredConductoresList: any[] = [];
  searchTerm: string = '';

  constructor(private profileService: ProfileService) { }

  user$: Observable<any>;
  userData: any;
  userType: number | null = null;

  ngOnInit() {
    this.user$ = this.profileService.getCurrentUser();
    this.user$.subscribe(data => {
      this.userData = data;
      console.log(this.userData);

    });

    this.loadConductoresList();
  }

  loadConductoresList() {
    this.profileService.getDriverListAct().subscribe(
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
        conductor.nombreCompleto.toLowerCase().includes(searchTermLower) ||
        conductor.patenteVehiculo.toLowerCase().includes(searchTermLower) ||
        conductor.marcaVehiculo.toLowerCase().includes(searchTermLower) ||
        conductor.nombreAsistente.toLowerCase().includes(searchTermLower) ||
        conductor.apellidoAsistente.toLowerCase().includes(searchTermLower)
      );
    }
  }

  async approveConductor(conductor: any) {
    console.log('Aprobado:', conductor);

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
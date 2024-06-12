import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-lista-conductores',
  templateUrl: './lista-conductores.component.html',
  styleUrls: ['./lista-conductores.component.scss'],
})
export class ListaConductoresComponent implements OnInit {
  conductoresList: any[] = [];
  filteredConductoresList: any[] = [];
  searchTerm: string = '';

  constructor(private profileService: ProfileService) {}

  ngOnInit() {
    this.profileService.getConductoresList().subscribe(
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
}
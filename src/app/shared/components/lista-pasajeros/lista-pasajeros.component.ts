import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-lista-pasajeros',
  templateUrl: './lista-pasajeros.component.html',
  styleUrls: ['./lista-pasajeros.component.scss'],
})
export class ListaPasajerosComponent implements OnInit {
  hijosList: any[] = [];
  filteredHijosList: any[] = [];
  searchTerm: string = '';
  errorMessage: string = '';

  constructor(private profileService: ProfileService) { }

  ngOnInit() {
    this.profileService.getTrips().subscribe(
      data => {
        this.hijosList = data;
        this.filteredHijosList = data;
      },
      error => {
        console.error('Error al obtener la lista de hijos:', error);
        this.errorMessage = 'Error al cargar la lista de hijos. Por favor, inténtalo de nuevo más tarde.';
      }
    );
  }

  filterHijos() {
    if (!this.searchTerm) {
      this.filteredHijosList = this.hijosList;
    } else {
      const searchTermLower = this.searchTerm.toLowerCase();
      this.filteredHijosList = this.hijosList.filter(hijo =>
        (hijo.nombreHijo && hijo.nombreHijo.toLowerCase().includes(searchTermLower)) ||
        (hijo.cursoHijo && hijo.cursoHijo.toLowerCase().includes(searchTermLower)) ||
        (hijo.familiaNombre && hijo.familiaNombre.toLowerCase().includes(searchTermLower)) ||
        (hijo.familiaApellido && hijo.familiaApellido.toLowerCase().includes(searchTermLower))
      );
    }
  }
}
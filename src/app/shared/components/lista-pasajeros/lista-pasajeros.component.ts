import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { formatDate } from '@angular/common';

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
  todayNames: string[] = [];
  todayDate: string; 

  constructor(private profileService: ProfileService) { 
    this.todayDate = formatDate(new Date(), 'dd/MM/yyyy', 'en');
  }

  ngOnInit() {
    this.profileService.getTrips().subscribe(
      data => {
        // Ensure data is an array
        this.hijosList = Array.isArray(data) ? data : Object.values(data);
        this.filteredHijosList = this.hijosList;
        this.getNamesForToday(this.hijosList);
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

  getNamesForToday(data: any[]) {
    const today = new Date().toISOString().split('T')[0];
    this.todayNames = [];

    data.forEach(item => {
      if (item[today] && item[today].nombre) {
        const names = item[today].nombre;
        if (Array.isArray(names)) {
          this.todayNames.push(...names);
        } else {
          this.todayNames.push(names);
        }
      }
    });
  }
}
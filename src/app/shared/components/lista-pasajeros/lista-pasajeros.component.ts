import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-lista-pasajeros',
  templateUrl: './lista-pasajeros.component.html',
  styleUrls: ['./lista-pasajeros.component.scss'],
})
export class ListaPasajerosComponent  implements OnInit {

  hijosList: any[] = [];
  filteredHijosList: any[] = [];
  searchTerm: string = '';


  constructor(private profileService: ProfileService) {}

  ngOnInit() {
    this.profileService.getHijosList().subscribe(hijos => {
      this.hijosList = hijos;
      this.filteredHijosList = hijos;
    });
  }

  filterHijos() {
    const term = this.searchTerm.toLowerCase();
    this.filteredHijosList = this.hijosList.filter(hijo =>
      hijo.nombreHijo.toLowerCase().includes(term) ||
      hijo.cursoHijo.toLowerCase().includes(term) ||
      hijo.familiaNombre.toLowerCase().includes(term) ||
      hijo.familiaApellido.toLowerCase().includes(term)
    );
  }

}

import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { Router } from '@angular/router'; // Importa Router para la navegación

@Component({
  selector: 'app-historial-viajes',
  templateUrl: './historial-viajes.component.html',
  styleUrls: ['./historial-viajes.component.scss'],
})
export class HistorialViajesComponent implements OnInit {

  familiaId: string;
  bills: any[] = [];
  conductor: any;
  familiaNombre:any;

  constructor(private profileService: ProfileService , private router: Router) { }

  async ngOnInit() {
    this.profileService.getCurrentUserId().subscribe(familiaId => {
      this.familiaId = familiaId;
    });
    (await this.profileService.getHiredDrivers(this.familiaId)).subscribe((bills: any[]) => {
      this.bills = bills;
    });
    
    
  }

  navigateToValoracionPage(bills: any) {
    this.router.navigate(['/valoracion'], {
      state: { // Pasa los datos como estado del navegador
        conductorId: bills.data.nombre,
        familiaNombre: bills.data.nombre, // Ajusta según cómo obtengas este dato en tu app
        
      }
    });
  }

}
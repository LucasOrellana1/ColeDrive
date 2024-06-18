import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.scss'],
})
export class FacturaComponent  implements OnInit {

  conductor: any;
  selectedDates: string[];
  userData: any;
  selectedHijo: any;
  familiaId: string;

  constructor(private router: Router, private profileService: ProfileService) { }

  async ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.conductor = navigation.extras.state['conductor'];
      this.selectedDates = navigation.extras.state['selectedDates'];
      this.userData = navigation.extras.state['userData'];
      this.selectedHijo = navigation.extras.state['selectedHijo'];
    }
    this.profileService.getCurrentUserId().subscribe(familiaId => {
      this.familiaId = familiaId;
    });
  }

  async confirmPayment() {
    try {
      await this.profileService.saveBill(
        this.familiaId,
        this.conductor,
        this.userData.nombre,
        this.userData.rut
      );
      console.log(this.conductor);
      console.log(this.userData.nombre);
      console.log(this.userData.rut);
      console.log(this.profileService.saveBill);

      
    } catch (error) {
      console.error('Error al guardar la factura:', error);
    }
  }


}

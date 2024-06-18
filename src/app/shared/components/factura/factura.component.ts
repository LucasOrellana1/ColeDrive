import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.scss'],
})
export class FacturaComponent implements OnInit {

  @Input() conductor: any;
  @Input() selectedDates: string[] = [];
  userData: any;
  selectedHijo: any;
  familiaId: string;
  total: number = 0;

  constructor(private router: Router, private profileService: ProfileService) { }

  async ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.conductor = navigation.extras.state['conductor'];
      this.selectedDates = navigation.extras.state['selectedDates'];
      this.userData = navigation.extras.state['userData'];
      this.selectedHijo = navigation.extras.state['selectedHijo'];
      this.calculateTotal();
    }
    this.profileService.getCurrentUserId().subscribe(familiaId => {
      this.familiaId = familiaId;
    });
  }

  calculateTotal() {
    const costPerDate = 5000; // Valor por fecha
    this.total = this.selectedDates.length * costPerDate;
  }

  async confirmPayment() {
    try {
      await this.profileService.saveBill(
        this.familiaId,
        this.conductor.data,
        this.userData.nombre,
        this.userData.rut,
        this.total
        
      );
      this.router.navigate(['/buscar']);
      
    } catch (error) {
      console.error('Error al guardar la factura:', error);
    }
  }
}
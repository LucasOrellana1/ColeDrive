import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-agendar',
  templateUrl: './agendar.page.html',
  styleUrls: ['./agendar.page.scss'],
})
export class AgendarPage implements OnInit {
  selectedDate: string | null = null;
  selectedDates: string[] = [];
  minDate: string = new Date().toISOString();
  conductor: any;
  familiaId: string = '';

  constructor(private alertController: AlertController, private router: Router,private profileService: ProfileService) { }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.conductor = navigation.extras.state['conductor'];
      console.log('Conductor recibido:', this.conductor);
    }
  }

  onDateSelected(event: any) {
    this.selectedDate = event.detail.value;
  }

  async confirmDate() {
    if (this.selectedDate && !this.selectedDates.includes(this.selectedDate)) {
      try {
        await this.profileService.scheduleService(this.familiaId, this.conductor.id, this.conductor.hijo, this.selectedDate);
        this.selectedDates.push(this.selectedDate);
        this.selectedDate = null;
      } catch (error) {
        console.error('Error al agendar el servicio:', error);
      }
    }
  }

  isDateEnabled = (dateIsoString: string) => {
    const date = new Date(dateIsoString);
    const day = date.getUTCDay();
    // deshabilitado Sabado (dia 6) y Domingo (dia 0)
    if (day === 0 || day === 6) {
      return false; // deshabilitar fin de semana
    }

    // Verificar si la fecha ya está seleccionada
    const formattedDate = date.toISOString().split('T')[0]; // formato 'yyyy-mm-dd'
    return !this.selectedDates.includes(formattedDate);
  }

  removeDate(index: number) {
    if (index >= 0 && index < this.selectedDates.length) {
      this.selectedDates.splice(index, 1);
    }
  }
}



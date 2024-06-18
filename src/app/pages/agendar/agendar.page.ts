import { Component, OnInit,Input } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/services/profile.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-agendar',
  templateUrl: './agendar.page.html',
  styleUrls: ['./agendar.page.scss'],
})
export class AgendarPage implements OnInit {


  user$: Observable<any>;
  userData: any;
  selectedDate: string | null = null;
  selectedDates: string[] = [];
  minDate: string = new Date().toISOString();
  conductor: any;
  familiaId: any;
  @Input() selectHijos: any[] = [];
  selectedHijo: any;
  

  constructor(private alertController: AlertController, private router: Router,private profileService: ProfileService) { }

  ngOnInit() {
    
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.conductor = navigation.extras.state['conductor'];
      console.log('Conductor recibido:', this.conductor);
    }

    this.user$ = this.profileService.getCurrentUser();
    this.user$.subscribe(data => {
      this.userData = data;
      console.log(this.userData);
      this.selectHijos = data.hijos.map((nombre: string) => ({ nombre: nombre }));
      
    });
  }

  onDateSelected(event: any) {
    // Obtener la fecha sin la hora
    const dateWithoutTime = event.detail.value.split('T')[0];
    this.selectedDate = dateWithoutTime;
    console.log(this.selectedDate);
  }

  async confirmDate() {
    if (this.selectedDate && !this.selectedDates.includes(this.selectedDate)) {
      
      try {
        this.familiaId = await this.profileService.getCurrentUserId();
        await this.profileService.scheduleService(this.familiaId, this.conductor.id, this.selectedHijo, this.selectedDate);
        this.selectedDates.push(this.selectedDate);
        console.log(this.userData.hijos);
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

  onSelectChange(event: any) {
    this.selectedHijo = event.detail.value;
    console.log('Hijo seleccionado:', this.selectedHijo);
  }

  goToFacturaPage() {
    this.router.navigate(['pago'], {
      state: {
        conductor: this.conductor,
        selectedDates: this.selectedDates,
        selectedHijo: this.selectedHijo,
        userData: this.userData
      }
    });
  }
}



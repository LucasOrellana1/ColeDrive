import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

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



  constructor(private alertController: AlertController, private router: Router) { }

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

  confirmDate() {
    if (this.selectedDate) {
      this.selectedDates.push(this.selectedDate);
      this.selectedDate = null;
    }
  }

  // Funcion para desactivar fin de semanans
  isDateEnabled = (dateIsoString: string) => {
    const date = new Date(dateIsoString);
    const day = date.getUTCDay();
    // deshabilitado Sabado (dia 6) y Domingo (dia 0)
    return day !== 0 && day !== 6;
  }

}



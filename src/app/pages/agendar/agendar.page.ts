import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-agendar',
  templateUrl: './agendar.page.html',
  styleUrls: ['./agendar.page.scss'],
})
export class AgendarPage implements OnInit {
  selectedDate: string | null = null;
  selectedDates: string[] = [];
  minDate: string = new Date().toISOString();

  

  constructor(private alertController: AlertController) { }

  ngOnInit() {  }

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
    // deshabilitado Sabado (dia 6) and Domingo (dia 0)
    return day !== 0 && day !== 6;
  }

}



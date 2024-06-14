import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.scss'],
})
export class CalendarioComponent  implements OnInit {

  selectedDate: string | null = null;
  selectedDates: string[] = [];
  minDate: string = new Date().toISOString();

  constructor(private alertController: AlertController) { }

  ngOnInit() {}

  onDateSelected(event: any) {
    this.selectedDate = event.detail.value;
  }

  async confirmDate() {
    if (this.selectedDate) {
      this.selectedDates.push(this.selectedDate);

      const alert = await this.alertController.create({
        header: 'Fecha Confirmada',
        message: `Has seleccionado la fecha: ${new Date(this.selectedDate).toLocaleDateString()}`,
        buttons: ['OK'],
      });

      await alert.present();

      // Limpiar la fecha seleccionada después de confirmar
      this.selectedDate = null;
    }
  }

}

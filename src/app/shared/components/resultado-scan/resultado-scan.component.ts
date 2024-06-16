import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-resultado-scan',
  templateUrl: './resultado-scan.component.html',
  styleUrls: ['./resultado-scan.component.scss'],
})
export class ResultadoScanComponent {
  @Input() rut: string;
  @Input() numDoc: string;
  @Input() names: string[];
  @Input() antecedentes: string;
  @Input() folioAnte: string;
  @Input() antecedentes2: string;
  @Input() folioAnte2: string;
  @Input() licenciaType: string;

  constructor(private modalController: ModalController) { }

  dismiss() {
    this.modalController.dismiss();
  }
}

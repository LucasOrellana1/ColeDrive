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

  constructor(private modalController: ModalController) { }

  dismiss() {
    this.modalController.dismiss();
  }
}

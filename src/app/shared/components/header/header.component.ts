import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() title!: String;
  @Input() backButton!: string;
  @Input() showCloseButton: boolean = false;

  constructor(private modalController: ModalController) { }

  close() {
    this.modalController.dismiss();
  }
  ngOnInit() { }

}

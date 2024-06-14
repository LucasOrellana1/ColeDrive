import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() title!: String;
  @Input() backButton!: string;
  @Input() showCloseButton: boolean = false;

  showMenuButton: boolean = true;

  constructor(
    private modalController: ModalController,
    private menuController: MenuController,
    private router: Router
  ) { }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      
      this.showMenuButton = event.url !== '/inicio';
    });
  }

  openMenu() {
    this.menuController.open();
  }

  close() {
    this.modalController.dismiss();
  }
}
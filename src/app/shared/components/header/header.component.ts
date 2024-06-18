import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { authService } from 'src/app/services/auth.service'; 


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
    private router: Router,
    private firebaseAuth: AngularFireAuth,
    private authService: authService
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

  async signOut() {
    try {
      await this.authService.signOut(); 
      this.router.navigate(['/inicio']); 
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  // Función para determinar si estamos en la página de perfil
  isPerfilPage(): boolean {
    return this.router.url.startsWith('/perfil');
  }

  // Función para manejar el clic en el botón de cerrar sesión
  handleSignOutClick() {
    if (this.isPerfilPage()) {
      this.signOut(); 
    } else {
      console.warn('No estás en la página de perfil.'); 
    }
  }
}
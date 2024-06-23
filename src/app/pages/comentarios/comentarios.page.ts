import { Component, OnInit } from '@angular/core';

import { ProfileService } from 'src/app/services/profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.page.html',
  styleUrls: ['./comentarios.page.scss'],
})
export class ComentariosPage implements OnInit {

  constructor(private profileService: ProfileService,private router: Router) { }
    
    conductor: any;

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.conductor = navigation.extras.state['conductor'];
      console.log('Conductor recibido:', this.conductor);
    }

  }

}

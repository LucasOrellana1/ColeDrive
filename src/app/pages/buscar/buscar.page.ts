import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.page.html',
  styleUrls: ['./buscar.page.scss'],
})
export class BuscarPage implements OnInit {
  userType: number | null = null;

  constructor(private profileService: ProfileService) {}

  ngOnInit() {
    this.profileService.getCurrentUser().subscribe(user => {
      if (user) {
        this.userType = user.tipoCuenta;
      }
    });
  }
}

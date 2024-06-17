import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-desactivar',
  templateUrl: './desactivar.page.html',
  styleUrls: ['./desactivar.page.scss'],
})
export class DesactivarPage implements OnInit {

  userType: number | null = null;

  constructor(private profileService: ProfileService) { }

  ngOnInit() {
    this.profileService.getCurrentUser().subscribe(user => {
      if (user) {
        this.userType = user.tipoCuenta;
      }
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-historial-viajes',
  templateUrl: './historial-viajes.component.html',
  styleUrls: ['./historial-viajes.component.scss'],
})
export class HistorialViajesComponent implements OnInit {

  familiaId: string;
  bills: any[] = [];

  constructor(private profileService: ProfileService) { }

  async ngOnInit() {
    this.profileService.getCurrentUserId().subscribe(familiaId => {
      this.familiaId = familiaId;
    });
    (await this.profileService.getHiredDrivers(this.familiaId)).subscribe((bills: any[]) => {
      this.bills = bills;
    });
    console.log(this.bills)
  }

}
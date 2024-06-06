import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {
  userData$: Observable<any>;

  constructor(private profileService: ProfileService) {}

  ngOnInit() {
    this.userData$ = this.profileService.getCurrentUser();
  }
}

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable, map, switchMap, take } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { ProfileService } from '../services/profile.service';

@Injectable({
  providedIn: 'root'
})

export class driverGuard implements CanActivate {

  constructor(  private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private profile: ProfileService,
    private router: Router){}

    canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean | UrlTree> {
      return this.profile.getCurrentUser().pipe(
        // Take evita fugas de memopria,
        // limitando el codigo solo a recibir la primera data enviada por el observable
        take(1),
        map(user => {
          if (user && user.tipoCuenta === 2) {
            return true;
          } else {
            this.router.navigate(['/login']);
            return false;
          }
        })
      );
    }
  }
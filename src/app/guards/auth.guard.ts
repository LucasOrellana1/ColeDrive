import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
/*
@Injectable({
  providedIn: 'root'
})

export class authGuard implements CanActivate {

  constructor(  private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router){}

    canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean | UrlTree> {
      const expectedAccountType = route.data['expectedAccountType'];
    }};
       return this.afAuth.authState.pipe(
        take(1),
        switchMap(user => {
          if (user) {
            return this.firestore.collection('users').doc(user.uid).get().pipe(
              map(doc => {
                const data = doc.data();
                const accountType = data?.['accountType'];
                if (accountType === expectedAccountType) {
                  return true;
                } else {
                  this.router.navigate(['/unauthorized']);
                  return false;
                }
              })
            );
          } else {
            this.router.navigate(['/login']);
            return false;
          }
        })
      );
    }
  */
  
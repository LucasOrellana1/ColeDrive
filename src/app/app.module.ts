import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { getStorage, provideStorage } from '@angular/fire/storage';

import {HttpClientModule} from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, IonicModule.forRoot(), AppRoutingModule, provideFirebaseApp(() => 
    
    initializeApp(environment.firebaseConfig)), 
    provideAuth(() => getAuth()), provideFirestore(() => getFirestore(),
  ), ReactiveFormsModule, FormsModule],


  providers: [{ provide: FIREBASE_OPTIONS, useValue: environment.firebaseConfig }, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, AngularFireAuth, AngularFirestore],
  bootstrap: [AppComponent],
})
export class AppModule {}

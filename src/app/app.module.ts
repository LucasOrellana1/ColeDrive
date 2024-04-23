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


@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, provideFirebaseApp(() => 
    
    initializeApp({"projectId":"coledrive-afdf5",
    "appId":"1:927471545441:web:9bb13129337d09b4f8ce20",
    "storageBucket":"coledrive-afdf5.appspot.com",
    "apiKey":"AIzaSyB-aW5LdHD25uCau_TdMHYVtJDeY0y9YV8",
    "authDomain":"coledrive-afdf5.firebaseapp.com",
    "messagingSenderId":"927471545441"})), 
    provideAuth(() => getAuth()), provideFirestore(() => getFirestore(),
  ), ReactiveFormsModule, FormsModule],


  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}

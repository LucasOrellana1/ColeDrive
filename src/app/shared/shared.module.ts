import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { ListaConductoresComponent } from './components/lista-conductores/lista-conductores.component';
import { ListaPasajerosComponent } from './components/lista-pasajeros/lista-pasajeros.component';
import { LogoComponent } from './components/logo/logo.component';
import { IonicModule } from '@ionic/angular';
import { ListaPasajerosDosComponent } from './components/lista-pasajeros-dos/lista-pasajeros-dos.component';




@NgModule({
  declarations: [
    HeaderComponent,
    ListaConductoresComponent,
    ListaPasajerosComponent,
    ListaPasajerosDosComponent,
    
    LogoComponent],
  exports: [
    HeaderComponent,
    ListaConductoresComponent,
    ListaPasajerosComponent,
    ListaPasajerosDosComponent,
    
    LogoComponent],
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class SharedModule { }

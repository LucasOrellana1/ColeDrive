import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { ListaConductoresComponent } from './components/lista-conductores/lista-conductores.component';
import { ListaPasajerosComponent } from './components/lista-pasajeros/lista-pasajeros.component';
import { LogoComponent } from './components/logo/logo.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [
    HeaderComponent,
    ListaConductoresComponent,
    ListaPasajerosComponent,
    LogoComponent],
  exports: [
    HeaderComponent,
    ListaConductoresComponent,
    ListaPasajerosComponent,
    LogoComponent],
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class SharedModule { }

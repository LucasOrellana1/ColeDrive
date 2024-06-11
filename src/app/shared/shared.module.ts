import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { HeaderComponent } from './components/header/header.component';
import { ListaConductoresComponent } from './components/lista-conductores/lista-conductores.component';
import { ListaPasajerosComponent } from './components/lista-pasajeros/lista-pasajeros.component';
import { ListaPasajerosDosComponent } from './components/lista-pasajeros-dos/lista-pasajeros-dos.component';
import { LogoComponent } from './components/logo/logo.component';
import { ResultadoScanComponent } from './components/resultado-scan/resultado-scan.component'; // Import the component

@NgModule({
  declarations: [
    HeaderComponent,
    ListaConductoresComponent,
    ListaPasajerosComponent,
    ListaPasajerosDosComponent,
    LogoComponent,
    ResultadoScanComponent // Declare the component
  ],
  exports: [
    HeaderComponent,
    ListaConductoresComponent,
    ListaPasajerosComponent,
    ListaPasajerosDosComponent,
    LogoComponent,
    ResultadoScanComponent // Export the component
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,  // Asegúrate de importar FormsModule
    ReactiveFormsModule  // Asegúrate de importar ReactiveFormsModule
  ]
})
export class SharedModule { }

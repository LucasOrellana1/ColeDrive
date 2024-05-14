import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormularioConductorPageRoutingModule } from './formulario-conductor-routing.module';
import { FormularioConductorPage } from './formulario-conductor.page';

import { OcrPage } from '../ocr/ocr.page';
import { Conductor } from 'src/app/services/user.interface';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    FormularioConductorPageRoutingModule,
  ],
  declarations: [FormularioConductorPage],
  providers: [OcrPage]
})
export class FormularioConductorPageModule {}

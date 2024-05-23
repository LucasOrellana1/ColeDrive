import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OcrPageRoutingModule } from './ocr-routing.module';

import { OcrPage } from './ocr.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OcrPageRoutingModule,
    SharedModule
  ],
  declarations: [OcrPage]
})
export class OcrPageModule {}

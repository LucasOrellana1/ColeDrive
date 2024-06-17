import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DesactivarPageRoutingModule } from './desactivar-routing.module';

import { DesactivarPage } from './desactivar.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DesactivarPageRoutingModule,
    SharedModule
  ],
  declarations: [DesactivarPage]
})
export class DesactivarPageModule {}

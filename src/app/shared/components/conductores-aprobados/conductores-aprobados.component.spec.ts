import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConductoresAprobadosComponent } from './conductores-aprobados.component';

describe('ConductoresAprobadosComponent', () => {
  let component: ConductoresAprobadosComponent;
  let fixture: ComponentFixture<ConductoresAprobadosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConductoresAprobadosComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConductoresAprobadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

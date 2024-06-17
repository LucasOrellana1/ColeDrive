import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DesactivarPage } from './desactivar.page';

describe('DesactivarPage', () => {
  let component: DesactivarPage;
  let fixture: ComponentFixture<DesactivarPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DesactivarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

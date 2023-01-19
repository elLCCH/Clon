import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetasPDFComponent } from './tarjetas-pdf.component';

describe('TarjetasPDFComponent', () => {
  let component: TarjetasPDFComponent;
  let fixture: ComponentFixture<TarjetasPDFComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TarjetasPDFComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetasPDFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

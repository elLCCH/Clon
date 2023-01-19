import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfmakepruebaComponent } from './pdfmakeprueba.component';

describe('PdfmakepruebaComponent', () => {
  let component: PdfmakepruebaComponent;
  let fixture: ComponentFixture<PdfmakepruebaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdfmakepruebaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfmakepruebaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

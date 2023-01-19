import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisorPDFComponent } from './visor-pdf.component';

describe('VisorPDFComponent', () => {
  let component: VisorPDFComponent;
  let fixture: ComponentFixture<VisorPDFComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisorPDFComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisorPDFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

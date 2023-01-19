import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaNuevosComponent } from './lista-nuevos.component';

describe('ListaNuevosComponent', () => {
  let component: ListaNuevosComponent;
  let fixture: ComponentFixture<ListaNuevosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaNuevosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaNuevosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

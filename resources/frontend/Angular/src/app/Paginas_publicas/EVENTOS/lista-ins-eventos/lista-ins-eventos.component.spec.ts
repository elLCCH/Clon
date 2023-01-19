import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaInsEventosComponent } from './lista-ins-eventos.component';

describe('ListaInsEventosComponent', () => {
  let component: ListaInsEventosComponent;
  let fixture: ComponentFixture<ListaInsEventosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaInsEventosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaInsEventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

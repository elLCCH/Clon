import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaDocenteEstComponent } from './tabla-docente-est.component';

describe('TablaDocenteEstComponent', () => {
  let component: TablaDocenteEstComponent;
  let fixture: ComponentFixture<TablaDocenteEstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablaDocenteEstComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaDocenteEstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

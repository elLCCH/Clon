import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarEstudiantesComponent } from './sidebar-estudiantes.component';

describe('SidebarEstudiantesComponent', () => {
  let component: SidebarEstudiantesComponent;
  let fixture: ComponentFixture<SidebarEstudiantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidebarEstudiantesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarEstudiantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

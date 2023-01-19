import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MnavComponent } from './mnav.component';

describe('MnavComponent', () => {
  let component: MnavComponent;
  let fixture: ComponentFixture<MnavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MnavComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MnavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

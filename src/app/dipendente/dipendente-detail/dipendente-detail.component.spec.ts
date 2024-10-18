import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DipendenteDetailComponent } from './dipendente-detail.component';

describe('DipendenteDetailComponent', () => {
  let component: DipendenteDetailComponent;
  let fixture: ComponentFixture<DipendenteDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DipendenteDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DipendenteDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

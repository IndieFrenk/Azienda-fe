import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DipendenteListComponent } from './dipendente-list.component';

describe('DipendenteListComponent', () => {
  let component: DipendenteListComponent;
  let fixture: ComponentFixture<DipendenteListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DipendenteListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DipendenteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

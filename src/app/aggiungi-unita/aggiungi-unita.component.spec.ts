import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AggiungiUnitaComponent } from './aggiungi-unita.component';

describe('AggiungiUnitaComponent', () => {
  let component: AggiungiUnitaComponent;
  let fixture: ComponentFixture<AggiungiUnitaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AggiungiUnitaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AggiungiUnitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

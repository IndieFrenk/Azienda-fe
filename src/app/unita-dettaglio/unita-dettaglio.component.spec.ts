import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitaDettaglioComponent } from './unita-dettaglio.component';

describe('UnitaDettaglioComponent', () => {
  let component: UnitaDettaglioComponent;
  let fixture: ComponentFixture<UnitaDettaglioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnitaDettaglioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitaDettaglioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

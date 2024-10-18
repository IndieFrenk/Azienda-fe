import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitaOrganizzativaDetailComponent } from './unita-organizzativa-detail.component';

describe('UnitaOrganizzativaDetailComponent', () => {
  let component: UnitaOrganizzativaDetailComponent;
  let fixture: ComponentFixture<UnitaOrganizzativaDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnitaOrganizzativaDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitaOrganizzativaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

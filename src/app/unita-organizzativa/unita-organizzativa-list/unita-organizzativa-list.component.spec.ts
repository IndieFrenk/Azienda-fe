import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitaOrganizzativaListComponent } from './unita-organizzativa-list.component';

describe('UnitaOrganizzativaListComponent', () => {
  let component: UnitaOrganizzativaListComponent;
  let fixture: ComponentFixture<UnitaOrganizzativaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnitaOrganizzativaListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitaOrganizzativaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

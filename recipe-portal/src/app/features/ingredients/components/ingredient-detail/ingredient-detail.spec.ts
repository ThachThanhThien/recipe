import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientDetail } from './ingredient-detail';

describe('IngredientDetail', () => {
  let component: IngredientDetail;
  let fixture: ComponentFixture<IngredientDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngredientDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngredientDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

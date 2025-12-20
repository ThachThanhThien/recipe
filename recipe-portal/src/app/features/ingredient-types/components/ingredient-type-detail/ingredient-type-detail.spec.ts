import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientTypeDetail } from './ingredient-type-detail';

describe('IngredientTypeDetail', () => {
  let component: IngredientTypeDetail;
  let fixture: ComponentFixture<IngredientTypeDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngredientTypeDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngredientTypeDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

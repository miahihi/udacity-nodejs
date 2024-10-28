import { ComponentFixture, TestBed } from '@angular/core/testing';

import { productPageComponent } from './product-page.component';

describe('productPageComponent', () => {
  let component: productPageComponent;
  let fixture: ComponentFixture<productPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ productPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(productPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

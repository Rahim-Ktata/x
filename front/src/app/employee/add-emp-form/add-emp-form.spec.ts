import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddEmpForm } from './add-emp-form';

describe('AddEmpForm', () => {
  let component: AddEmpForm;
  let fixture: ComponentFixture<AddEmpForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEmpForm],
    }).compileComponents();

    fixture = TestBed.createComponent(AddEmpForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

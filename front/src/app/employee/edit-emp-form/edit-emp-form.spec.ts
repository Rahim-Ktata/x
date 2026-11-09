import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditEmpForm } from './edit-emp-form';

describe('EditEmpForm', () => {
  let component: EditEmpForm;
  let fixture: ComponentFixture<EditEmpForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditEmpForm],
    }).compileComponents();

    fixture = TestBed.createComponent(EditEmpForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

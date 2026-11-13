import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatchyComp } from './matchy-comp';

describe('MatchyComp', () => {
  let component: MatchyComp;
  let fixture: ComponentFixture<MatchyComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchyComp],
    }).compileComponents();

    fixture = TestBed.createComponent(MatchyComp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

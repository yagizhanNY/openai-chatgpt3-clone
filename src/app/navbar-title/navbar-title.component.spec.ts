import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarTitleComponent } from './navbar-title.component';

describe('NavbarTitleComponent', () => {
  let component: NavbarTitleComponent;
  let fixture: ComponentFixture<NavbarTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarTitleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

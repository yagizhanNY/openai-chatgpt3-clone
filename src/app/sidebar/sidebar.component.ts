import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  showSideBar: boolean = true;
  @Output() sideBarOnDisplayEvent = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  closeSideBarMenu() {
    this.showSideBar = !this.showSideBar;
    this.sideBarOnDisplayEvent.emit(this.showSideBar);
  }
}

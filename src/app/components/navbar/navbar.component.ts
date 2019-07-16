import { CommService } from './../../services/comm.service';
import { DatastoreService } from './../../services/datastore.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  
  constructor(private ds: DatastoreService, private comm: CommService) { }

  ngOnInit() {
    // Wait 1/2 sec then load the default (DAMPS) information
    setTimeout(() => {
      this.ds.curSelectedButton = "damps"
      this.comm.navbarClicked.emit();
      }, 500);
  }

  //When a nav button is selected
  btnClickEvtHandler(btnLbl){
    this.ds.curSelectedButton = btnLbl;
    this.comm.navbarClicked.emit();
  }
}

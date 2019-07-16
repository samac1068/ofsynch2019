import { DatastoreService } from './../../services/datastore.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {

  version: string;

  constructor(private ds: DatastoreService) { }

  ngOnInit() {
    this.version = this.ds.getVersion();
  }

}

import { Component, OnInit } from '@angular/core';
import { DatastoreService } from './services/datastore.service';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'OFS 2019';

  constructor(private ds: DatastoreService, private data: DataService){}
  
  ngOnInit() {
    //During initialization, need to identify which server is hosting the latest API.
    if(this.ds.getWSAPI() == ""){
      this.data.setWSServer()
      .subscribe((results) => {
        this.data.identifyAPIServerLocation(results.api)
      });
    }  
  }
}

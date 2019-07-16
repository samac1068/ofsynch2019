import { Damps } from './../../../models/damps';
import { CommService } from './../../../services/comm.service';
import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DatastoreService } from 'src/app/services/datastore.service';

@Component({
  selector: 'app-damps',
  templateUrl: './damps.component.html',
  styleUrls: ['./damps.component.css']
})
export class DampsComponent implements OnInit {
  
  @Input() public isNewRecord:boolean;
  
  //Data providers
  dampsData: any = [];
  operations: any = [];
  cycle: any = [];
  pay: any = [];
  tcs: any = [];
  conusa: any = [];

  //Form Validators
  opControl = new FormControl('', [Validators.required]);
  cycleControl = new FormControl('', [Validators.required]);
  payControl = new FormControl('', [Validators.required]);
  tcsControl = new FormControl('', [Validators.required]);
  conusaControl = new FormControl('', [Validators.required]);
  
  constructor(private comm:CommService, private ds: DatastoreService) { }

  ngOnInit() {
      this.comm.submitRecClicked.subscribe(() => {
        console.log("Submitting information for rec id " + this.ds.curSelectedRecord.ID + " for operation " + this.ds.curSelectedButton);
      });

      this.comm.createNewClicked.subscribe(() => {
        console.log("Create a new item");        
        this.updateDataLoad();
      });

      this.comm.editRecClicked.subscribe(() => {
        this.dampsData = this.ds.curSelectedRecord;
        this.updateDataLoad();
      });
      
  }

  // Used to get the latest batch of stored DDL information
  updateDataLoad() {
    this.operations = this.ds.opsData["operations"];
    this.tcs = this.ds.opsData["tcs"];
    this.pay = this.ds.opsData["pay"];
    this.conusa = this.ds.opsData["conusa"];
    this.cycle = this.ds.opsData["cycle"];
  }

  resetAllFields(){
    this.dampsData = [];
  }

  storeAllChanges(obj) {
    console.log(obj)
;  }
}

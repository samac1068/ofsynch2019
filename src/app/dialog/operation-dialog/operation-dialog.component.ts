import { CommService } from 'src/app/services/comm.service';
import { MissionAssign } from './../../models/missionassign';
import { DataService } from './../../services/data.service';
import { Component, OnInit } from '@angular/core';
import { DatastoreService } from 'src/app/services/datastore.service';
import { DualListComponent } from 'angular-dual-listbox';
import { MatDialogRef } from '@angular/material';
import { Operation } from 'src/app/models/operations';
import { Locations } from 'src/app/models/locations';
import { ConfirmDialogService } from '../confirm-dialog/confirm-dialog.service';

@Component({
  selector: 'app-operation-dialog',
  templateUrl: './operation-dialog.component.html',
  styleUrls: ['./operation-dialog.component.css']
})
export class OperationDialogComponent implements OnInit {

  dlHeight: string = "220px";
  dlFormat: any = {add: 'ADD', remove: 'REMOVE', all: 'ALL', none: 'NONE', direction: DualListComponent.RTL, draggable: true, locale: undefined};
  
  currList: Locations[] = [];

  selOp: Operation = null;
  missionAssign: MissionAssign[] = [];
  locations: any = [];

  availCount: number = 0;
  assignedCount: number = 0;

  assignedStorage: Locations[] = [];

  constructor(private ds: DatastoreService, private data: DataService, public dialogRef: MatDialogRef<OperationDialogComponent>, 
    private cds: ConfirmDialogService, private comm: CommService) { }

  ngOnInit() {
    this.selOp = this.ds.curSelectedRecord;
    this.updateDataLoad();
  }

  updateDataLoad() {
    this.locations = this.ds.opsData["missionlocations"];
    
    // Update the mission assigned list to reflect the recent change
    this.data.getSubOperationData('missionAssign')
    .subscribe((results) => {
      this.ds.opsData["missionAssign"] = results;
      this.missionAssign = results;

      // build the lists
      this.buildListsForOperation();
    });
  }

  buildListsForOperation() {
    // Get all of the location ID for this specific operation
    this.currList = [];
    this.assignedStorage = [];

    var currentList = this.missionAssign.filter(ma => { return ma.op_id === this.selOp.op_id; });

    // Based on that list, loop through and build the CurrList 
    currentList.forEach((row) => { 
      var locale: Locations = this.locations.find((lo) => { return lo.lngMissionLocationID == row.location_id; });
      if(locale != null)  
        this.currList.push(locale);
        this.assignedStorage.push(locale);
    });

    this.setSortOnChg();
  }

  processRequestedChange(evt){
    this.setSortOnChg();  //Sort it out
    
    //perform comparison and identify the one item that has changes (added or removed)
    let atob: any = this.assignedStorage.filter(item => this.currList.indexOf(item) < 0);  // Removed from Current
    let btoa: any = this.currList.filter(item => this.assignedStorage.indexOf(item) < 0);  // Added to Current

    console.log(atob, btoa);

    var chgValue: MissionAssign = new MissionAssign();
    if(atob.length == 0 && btoa.length > 0) {//Added
      chgValue = { id: 0, op_id: this.selOp.op_id, location_id: btoa[0].lngMissionLocationID };
    } else if(atob.length > 0 && btoa.length == 0) {  //Removed
      chgValue = { id: -1, op_id: this.selOp.op_id, location_id: atob[0].lngMissionLocationID };
    }

    this.data.modifyOpsLocationData(chgValue)
    .subscribe((results) => {
      if(results.ID == 0)
        this.cds.acknowledge(this.ds.acknowTitle, 'Failed - Reason: ' + results.processMsg, 'OK');
      else {
        this.updateDataLoad();
      }
    });
  }

  setSortOnChg() {
    //Sort both of the lists
    this.sortMLArray(this.currList);
    this.sortMLArray(this.locations);

    this.availCount = this.locations.length;
    this.assignedCount = this.currList.length;
  }

  sortMLArray(arr: any) {
    arr.sort((a: any, b: any) => { 
      if(a.strMissionLocation < b.strMissionLocation) { return -1; }
      if(a.strMissionLocation > b.strMissionLocation) { return 1; }
      return 0;
    }); 

    return arr;
  }

  killDialog() {
    this.comm.signalReload.emit();
    this.dialogRef.close();
    console.log("All changes have been saved");
  }

}

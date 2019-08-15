import { DataService } from './../../services/data.service';
import { Component, OnInit } from '@angular/core';
import { DatastoreService } from 'src/app/services/datastore.service';
import { DualListComponent } from 'angular-dual-listbox';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-operation-dialog',
  templateUrl: './operation-dialog.component.html',
  styleUrls: ['./operation-dialog.component.css']
})
export class OperationDialogComponent implements OnInit {

  dlHeight: string = "200px";
  dlFormat: any = {add: 'ADD', remove: 'REMOVE', all: 'ALL', none: 'NONE', direction: DualListComponent.LTR, draggable: true, locale: undefined};
  availList: any = [];
  currList: any = [];
  selOp: string = "None";

  constructor(private ds: DatastoreService, private data: DataService, public dialogRef: MatDialogRef<OperationDialogComponent>) { }

  ngOnInit() {

  }

  killDialog() {
    this.dialogRef.close();
    console.log("All changes have been saved");
  }

}

import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CommService } from 'src/app/services/comm.service';
import { DatastoreService } from 'src/app/services/datastore.service';
import { ConfirmDialogService } from 'src/app/dialog/confirm-dialog/confirm-dialog.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css']
})
export class PayComponent implements OnInit {

  @Input() public isNewRecord:boolean;
  
  selRec: any = {};
  chgArr: string[] = [];
  
  opControl = new FormControl('', [Validators.required]);
  descControl = new FormControl('', [Validators.required]);
  
  constructor(private comm:CommService, private ds: DatastoreService, private cds: ConfirmDialogService, private data: DataService) { }

  ngOnInit() {
    this.comm.submitRecClicked.subscribe(() => {
      //if(this.ds.curSelectedButton == "orders") {
        //console.log("submit has been clicked", this.chgArr.length);
        if(this.chgArr.length > 0) {
          this.cds.confirm('ORDERS - Submission', 'Confirm you want to submit the ' + this.chgArr.length + ' change(s)?', 'Yes', 'No')
          .then((confirmed) => { 
            if (confirmed) {
              /* this.data.getTestDisplayOfObject(this.operations)  // We are going to do a test saving
              .subscribe(results => console.log(results)); */
              console.log("yeah gonna save in a minute.") ;
            }
          })
          .catch(() => console.log('User dismissed the dialog'));
        }
      //}
    });

    this.comm.createNewClicked.subscribe(() => {
      //if(this.ds.curSelectedButton == "orders") {
        this.chgArr = [];
        this.updateDataLoad();
      //}
    });

    this.comm.editRecClicked.subscribe(() => {
      //if(this.ds.curSelectedButton == "orders") {
        this.chgArr = [];
        this.selRec = this.ds.curSelectedRecord;
        console.log(this.selRec);
        this.updateDataLoad();
      //}
    });
  }

  updateDataLoad() {
    // No DDL to load
  }

  resetAllFields(){
    this.selRec = null;
  }

  storeAllChanges(e: any) {
    if(this.chgArr.indexOf(e.source.id) == -1)
      this.chgArr.push(e.source.id);
  }

  textChanges(e){
    if(this.chgArr.indexOf(e.target.id) == -1)
      this.chgArr.push(e.target.id);
  }
}

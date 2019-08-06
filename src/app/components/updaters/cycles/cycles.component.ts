import { ConfirmDialogService } from './../../../dialog/confirm-dialog/confirm-dialog.service';
import { CommService } from './../../../services/comm.service';
import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DatastoreService } from 'src/app/services/datastore.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-cycles',
  templateUrl: './cycles.component.html',
  styleUrls: ['./cycles.component.css']
})
export class CyclesComponent implements OnInit {

  @Input() public isNewRecord:boolean;
  
  //Data providers
  selRec: any = {};
  chgArr: string[] = [];

  //Form Validators
  cycleControl = new FormControl('', [Validators.required]);
  fyControl = new FormControl('', [Validators.required]);
   
  constructor(private comm:CommService, private ds: DatastoreService, private cds: ConfirmDialogService, private data: DataService) { }

  ngOnInit() {
    this.comm.submitRecClicked.subscribe(() => {
      //if(this.ds.curSelectedButton == "damps") {
        //console.log("submit has been clicked", this.chgArr.length);
        if(this.chgArr.length > 0) {
          this.cds.confirm('DAMPS - Submission', 'Confirm you want to submit the ' + this.chgArr.length + ' change(s)?', 'Yes', 'No')
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
      //if(this.ds.curSelectedButton == "damps") {
        this.chgArr = [];
        this.updateDataLoad();
      //}
    });

    this.comm.editRecClicked.subscribe(() => {
      //if(this.ds.curSelectedButton == "damps") {
        this.chgArr = [];
        this.selRec = this.ds.curSelectedRecord;
        this.updateDataLoad();
      //}
    });
  }

  // Used to get the latest batch of stored DDL information
  updateDataLoad() {
    // None needed for Cycles
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

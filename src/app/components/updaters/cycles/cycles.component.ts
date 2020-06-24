import { Cycle } from './../../../models/cycle';
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
  invalidMsg: string[] = [];

  //Form Validators
  cycleControl = new FormControl('', [Validators.required]);
  fyControl = new FormControl('', [Validators.required]);
   
  constructor(private comm:CommService, private ds: DatastoreService, private cds: ConfirmDialogService, private data: DataService) { }

  ngOnInit() {
    this.comm.submitRecClicked.subscribe(() => {
      if(this.ds.curSelectedButton == "cycles") {
        if(this.chgArr.length > 0) {
          this.ValidateFormData();
          if(this.invalidMsg.length == 0){
            this.cds.confirm('CYCLE - Submission', 'Confirm you want to submit the ' + this.chgArr.length + ' change(s)?', 'Yes', 'No')
            .then((confirmed) => { 
              if (confirmed) {
                this.ds.curSelectedRecord = this.selRec;
                this.data.updateCycleRecord()
                .subscribe((results) => {
                  if(results.ID == 0) 
                    this.cds.acknowledge(this.ds.acknowTitle, 'Failed - Reason: ' + results.processMsg, 'OK');
                  else
                  {
                    this.resetAllFields();
                    this.comm.signalReload.emit();
                    this.cds.acknowledge(this.ds.acknowTitle, 'Operation Successful!', 'OK');
                  }
                });
              }
            })
            .catch(() => console.log('User dismissed the dialog'));
          }
          else
            this.cds.acknowledge('CYCLE: Incomplete Form', 'You must ' + this.invalidMsg.join(', ') + '.', 'OK', 'lg');
        }
        else
          this.cds.acknowledge('CYCLE: Invalid Submission', "You have not made any changes to this record.", 'OK');
      }
    });


    this.comm.createNewClicked.subscribe(() => {
      this.chgArr = [];
      this.selRec = new Cycle();
      this.setDefaultItems();
      this.updateDataLoad();
    });
  
    this.comm.editRecClicked.subscribe(() => {
        this.chgArr = [];
        this.selRec = this.ds.curSelectedRecord;

        if(this.selRec.opHidden == null) this.selRec.opHidden = 0;
        this.updateDataLoad();
    });

    this.comm.cancelRecClicked.subscribe(() => {
      this.chgArr = [];
    });
  }

  setDefaultItems(){
    this.selRec.opHidden = 0;
  }

  // Used to get the latest batch of stored DDL information
  updateDataLoad() {
    // None needed for Cycles
  }

  resetAllFields(){
    this.selRec = new Cycle();
  }

  storeAllChanges(e: any) {
    if(this.chgArr.indexOf(e.source.id) == -1)
      this.chgArr.push(e.source.id);
  }

  textChanges(e){
    if(this.chgArr.indexOf(e.target.id) == -1)
      this.chgArr.push(e.target.id);
  }

  ValidateFormData() {
    // Check each of the list form controls to make sure they are valid
    this.invalidMsg = [];

    if(this.cycleControl.invalid) this.invalidMsg.push("enter a cycle");
    if(this.fyControl.invalid) this.invalidMsg.push("enter a FY");
     
    return null;
  }
}

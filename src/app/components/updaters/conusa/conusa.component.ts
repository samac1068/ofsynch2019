import { Conusa } from './../../../models/conusa';
import { ConfirmDialogService } from './../../../dialog/confirm-dialog/confirm-dialog.service';
import { CommService } from './../../../services/comm.service';
import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DatastoreService } from 'src/app/services/datastore.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-conusa',
  templateUrl: './conusa.component.html',
  styleUrls: ['./conusa.component.css']
})
export class ConusaComponent implements OnInit {

  @Input() public isNewRecord:boolean;
  
  //Data providers
  selRec: any = {};
  chgArr: string[] = [];
  invalidMsg: string[] = [];

  //Form Validators
  shNameControl = new FormControl('', [Validators.required]);
  lgNameControl = new FormControl('', [Validators.required]);
  authidControl = new FormControl('', [Validators.required]);

  constructor(private comm:CommService, private ds: DatastoreService, private cds: ConfirmDialogService, private data: DataService) { }

  ngOnInit() {
    this.comm.submitRecClicked.subscribe(() => {
      if(this.chgArr.length > 0) {
        this.ValidateFormData();
        if(this.invalidMsg.length == 0){
          this.cds.confirm('CONUSA - Submission', 'Confirm you want to submit the ' + this.chgArr.length + ' change(s)?', 'Yes', 'No')
          .then((confirmed) => { 
            if (confirmed) {
              this.ds.curSelectedRecord = this.selRec;
              this.data.modifyFPOperationRecord()
              .subscribe((results) => {
                if(results.ID == 0) 
                  this.cds.acknowledge('Operation Status', 'Failed - Reason: ' + results.processMsg, 'OK');
                else
                {
                  this.resetAllFields();
                  this.comm.signalReload.emit();
                  this.cds.acknowledge('Operation Status', 'Operation Successful!', 'OK');
                }
              });
            }
          })
          .catch(() => console.log('User dismissed the dialog'));
        }
        else
          this.cds.acknowledge('Incomplete Form', 'You must ' + this.invalidMsg.join(', ') + '.', 'OK', 'lg');
      }
      else
        this.cds.acknowledge('Invalid Submission', "You have not made any changes to this record.", 'OK');
    });

    this.comm.createNewClicked.subscribe(() => {
      this.chgArr = [];
      this.selRec = new Conusa();
      this.setDefaultItems();
      this.updateDataLoad();
    });
  
    this.comm.editRecClicked.subscribe(() => {
        this.chgArr = [];
        this.selRec = this.ds.curSelectedRecord;
        this.updateDataLoad();
    });
  }

  setDefaultItems(){
  
  }

  // Used to get the latest batch of stored DDL information
  updateDataLoad() {
    // Nothing to preload for DDL
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

  ValidateFormData() {
    // Check each of the list form controls to make sure they are valid
    this.invalidMsg = [];

    if(this.shNameControl.invalid) this.invalidMsg.push("enter a short name");
    if(this.lgNameControl.invalid) this.invalidMsg.push("enter a long name");
    if(this.authidControl.invalid) this.invalidMsg.push("enter a authority id");
     
    return null;
  }
}

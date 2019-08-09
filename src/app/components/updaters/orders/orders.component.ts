import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CommService } from 'src/app/services/comm.service';
import { DatastoreService } from 'src/app/services/datastore.service';
import { ConfirmDialogService } from 'src/app/dialog/confirm-dialog/confirm-dialog.service';
import { DataService } from 'src/app/services/data.service';
import { Operation } from 'src/app/models/operations';
import { Cycle } from 'src/app/models/cycle';
import { Damps } from 'src/app/models/damps';
import { Orders } from 'src/app/models/orders';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  @Input() public isNewRecord:boolean;
  
  selRec: any = {};
  chgArr: string[] = [];
  invalidMsg: string[] = [];
  operations: Operation = null;
  cycles: Cycle[] = [];
  damps: Damps[] = [];

  opControl = new FormControl('', [Validators.required]);
  cycleControl = new FormControl('', [Validators.required]);
  dampsControl = new FormControl('', [Validators.required]);

  constructor(private comm:CommService, private ds: DatastoreService, private cds: ConfirmDialogService, private data: DataService) { }

  ngOnInit() {
    this.comm.submitRecClicked.subscribe(() => {
      if(this.chgArr.length > 0) {
        this.ValidateFormData();
        if(this.invalidMsg.length == 0){
          this.cds.confirm('ORDERS - Submission', 'Confirm you want to submit the ' + this.chgArr.length + ' change(s)?', 'Yes', 'No')
          .then((confirmed) => { 
            if (confirmed) {
              this.ds.curSelectedRecord = this.selRec; 
              this.data.modifyOrdersRecord()
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
      this.selRec = new Orders();
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
  
  updateDataLoad() {
    this.operations = this.ds.opsData["operations"];
    this.damps = this.ds.opsData["damps"];
    this.cycles = this.ds.opsData["cycles"];
  }

  resetAllFields(){
    this.selRec = new Orders();
    this.chgArr = [];
  }

  storeAllChanges(e: any) {
    if(this.chgArr.indexOf(e.source.id) == -1)
      this.chgArr.push(e.source.id);
  }

  textChanges(e: any){
    if(this.chgArr.indexOf(e.target.id) == -1)
      this.chgArr.push(e.target.id);
  }

  ValidateFormData() {
    // Check each of the list form controls to make sure they are valid
    this.invalidMsg = [];

    if(this.dampsControl.invalid) this.invalidMsg.push("select an FP operation");
    if(this.opControl.invalid) this.invalidMsg.push("select an operation");
    if(this.cycleControl.invalid) this.invalidMsg.push("select a cycle");
     
    return null;
  }
}

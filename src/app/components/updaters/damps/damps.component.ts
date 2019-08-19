import { Conusa } from './../../../models/conusa';
import { TCS } from './../../../models/tcs';
import { Pay } from './../../../models/pay';
import { ConfirmDialogService } from './../../../dialog/confirm-dialog/confirm-dialog.service';
import { Damps } from './../../../models/damps';
import { CommService } from './../../../services/comm.service';
import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DatastoreService } from 'src/app/services/datastore.service';
import { DataService } from 'src/app/services/data.service';
import { Cycle } from 'src/app/models/cycle';

@Component({
  selector: 'app-damps',
  templateUrl: './damps.component.html',
  styleUrls: ['./damps.component.css']
})
export class DampsComponent implements OnInit {
  
  @Input() public isNewRecord:boolean;
  
  //Data providers
  selRec: any = {};
  operations: Damps = null;
  cycles: Cycle[] = [];
  pay: Pay[] = [];
  tcs: TCS[] = [];
  conusa: Conusa[] = [];

  chgArr: string[] = [];
  invalidMsg: string[] = [];

  //Form Validators
  descControl = new FormControl('', [Validators.required]);
  opControl = new FormControl('', [Validators.required]);
  cycleControl = new FormControl('', [Validators.required]);
  payControl = new FormControl('', [Validators.required]);
  tcsControl = new FormControl('', [Validators.required]);
  conusaControl = new FormControl('', [Validators.required]);
  
  constructor(private comm:CommService, private ds: DatastoreService, private cds: ConfirmDialogService, private data: DataService) { }

  ngOnInit() {
    this.comm.submitRecClicked.subscribe(() => {
      if(this.chgArr.length > 0) {
        this.ValidateFormData();
        if(this.invalidMsg.length == 0){
          this.cds.confirm('DAMPS - Submission', 'Confirm you want to submit the ' + this.chgArr.length + ' change(s)?', 'Yes', 'No')
          .then((confirmed) => { 
            if (confirmed) {
              this.ds.curSelectedRecord = this.selRec;
              this.data.modifyFPOperationRecord()
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
          this.cds.acknowledge('Incomplete Form', 'You must ' + this.invalidMsg.join(', ') + '.', 'OK', 'lg');
      }
      else
        this.cds.acknowledge('Invalid Submission', "You have not made any changes to this record.", 'OK');
    });

    this.comm.createNewClicked.subscribe(() => {
        this.chgArr = [];
        this.selRec = new Damps();
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
    this.selRec.ID = 0;  //Indication that this is a new record.
    this.selRec.hidden = 0;
    this.selRec.ma12301_d = 0;
    this.selRec.ma12302 = 0;
    this.selRec.ma12304 = 0;
    this.selRec.ma12304_a = 0;
    this.selRec.ma12304_b = 0;
    this.selRec.ma12302_border = 0;
    this.selRec.UIC_ToNipr = 0;
    this.selRec.MOBCAP = -1;
  }

  // Used to get the latest batch of stored DDL information
  updateDataLoad() {
    this.operations = this.ds.opsData["operations"];
    this.tcs = this.ds.opsData["tcs"];
    this.pay = this.ds.opsData["pay"];
    this.conusa = this.ds.opsData["conusa"];
    this.cycles = this.ds.opsData["cycles"];
  }

  resetAllFields(){
    this.selRec = new Damps();
    this.chgArr = [];
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

    if(this.descControl.invalid) this.invalidMsg.push("enter a description");
    if(this.opControl.invalid) this.invalidMsg.push("select an operation");
    if(this.cycleControl.invalid) this.invalidMsg.push("select a cycle");
    if(this.payControl.invalid) this.invalidMsg.push("select a PAY");
    if(this.tcsControl.invalid) this.invalidMsg.push("select a TCS");
    if(this.conusaControl.invalid) this.invalidMsg.push("select a CONUSA");
     
    // Make sure value isn't null
    if(this.selRec.MOBCAP == null || this.selRec.MOBCAP == undefined || this.selRec.MOBCAP.length == 0)
      this.selRec.MOBCAP = -1;

    return null;
  }
}

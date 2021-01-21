import {Conusa} from 'src/app/models/conusa';
import {TCS} from 'src/app/models/tcs';
import {Pay} from 'src/app/models/pay';
import {ConfirmDialogService} from 'src/app/dialog/confirm-dialog/confirm-dialog.service';
import {Damps} from 'src/app/models/damps';
import {CommService} from 'src/app/services/comm.service';
import {Component, OnInit, Input} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {DatastoreService} from 'src/app/services/datastore.service';
import {DataService} from 'src/app/services/data.service';
import {Cycle} from 'src/app/models/cycle';
import {MatCheckbox} from '@angular/material';

@Component({
  selector: 'app-damps',
  templateUrl: './damps.component.html',
  styleUrls: ['./damps.component.css']
})
export class DampsComponent implements OnInit {

  @Input() public isNewRecord: boolean;

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

  constructor(private comm: CommService, private ds: DatastoreService, private cds: ConfirmDialogService, private data: DataService) {
  }

  ngOnInit() {
    this.comm.submitRecClicked.subscribe(() => {
      if (this.ds.curSelectedButton == 'damps') {
        console.log('============================');
        console.log('Changes selected', this.chgArr.length);
        if (this.chgArr.length > 0) {
          this.ValidateFormData();
          console.log('selRec', this.selRec);
          this.ds.curSelectedRecord = this.selRec;
          if (this.invalidMsg.length == 0) {
            this.cds.confirm('DAMPS - Submission', 'Confirm you want to submit the ' + this.chgArr.length + ' change(s)?', 'Yes', 'No')
                .then((confirmed) => {
                  if (confirmed) {
                    this.data.modifyFPOperationRecord()
                        .subscribe((results) => {
                          if (results.ID == 0) {
                            this.cds.acknowledge(this.ds.acknowTitle, 'Failed - Reason: ' + results.processMsg, 'OK');
                          } else {
                            this.resetAllFields();
                            this.comm.signalReload.emit();
                            this.cds.acknowledge(this.ds.acknowTitle, 'Operation Successful!', 'OK');
                          }
                        });
                  }
                })
                .catch(() => console.log('User dismissed the dialog'));
          } else {
            this.cds.acknowledge('DAMPS: Incomplete Form', 'You must ' + this.invalidMsg.join(', ') + '.', 'OK', 'lg');
          }
        } else {
          this.cds.acknowledge('DAMPS: Invalid Submission', 'You have not made any changes to this record.', 'OK');
        }
        console.log('============================');
      }
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

    this.comm.cancelRecClicked.subscribe(() => {
      this.chgArr = [];
    });
  }

  setDefaultItems() {
    this.selRec.ID = 0;  //Indication that this is a new record.
    this.selRec.opHidden = 0;
    this.selRec.ma12301_d = 0;
    this.selRec.ma12302 = 0;
    this.selRec.ma12302_Corona = 0;
    this.selRec.ma12302_Border = 0;
    this.selRec.ma12304 = 0;
    this.selRec.ma12304_a = 0;
    this.selRec.ma12304_b = 0;
    this.selRec.UIC_ToNipr = 0;
    this.selRec.MOBCAP = -1;
  }

  // Used to get the latest batch of stored DDL information
  updateDataLoad() {
    this.operations = this.ds.opsData['operations'];
    this.tcs = this.ds.opsData['tcs'];
    this.pay = this.ds.opsData['pay'];
    this.conusa = this.ds.opsData['conusa'];
    this.cycles = this.ds.opsData['cycles'];
  }

  resetAllFields() {
    this.selRec = new Damps();
    this.chgArr = [];
  }

  storeAllChanges(e: any) {
    if (this.chgArr.indexOf(e.source.id) == -1) {
      this.chgArr.push(e.source.id);
    } else {
      if (e.source instanceof MatCheckbox) { //So remove the selected checkbox from the change event - but only if a checkbox
        this.chgArr.splice(this.chgArr.indexOf(e.source.id), 1);
      }
    }

    console.log('storeAllChanges', this.chgArr);
  }

  textChanges(e) {
    if (this.chgArr.indexOf(e.target.id) == -1) {
      this.chgArr.push(e.target.id);
    }
  }

  ValidateFormData() {
    // Check each of the list form controls to make sure they are valid
    this.invalidMsg = [];

    if (this.descControl.invalid) this.invalidMsg.push('enter a description');
    if (this.opControl.invalid) this.invalidMsg.push('select an operation');
    if (this.cycleControl.invalid) this.invalidMsg.push('select a cycle');
    if (this.payControl.invalid) this.invalidMsg.push('select a PAY');
    if (this.tcsControl.invalid) this.invalidMsg.push('select a TCS');
    if (this.conusaControl.invalid) this.invalidMsg.push('select a CONUSA');

    this.correctForNulls();

    return null;
  }

  correctForNulls() {
    // Make sure value isn't null
    if (this.selRec.ID == null) this.selRec.ID = 0;
    if (this.selRec.MOBCAP == null || this.selRec.MOBCAP.length == 0) this.selRec.MOBCAP = -1;
    if (this.selRec.Description == null || this.selRec.Description.length == 0) this.selRec.Description = '';
    if (this.selRec.opHidden == null) this.selRec.opHidden = 0;
    if (this.selRec.ma12301_d == null) this.selRec.ma12301_d = 0;
    if (this.selRec.ma12302 == null) this.selRec.ma12302 = 0;
    if (this.selRec.ma12304 == null) this.selRec.ma12304 = 0;
    if (this.selRec.ma12304_a == null) this.selRec.ma12304_a = 0;
    if (this.selRec.ma12304_b == null) this.selRec.ma12304_b = 0;
    if (this.selRec.ma12302_Corona == null) this.selRec.ma12302_Corona = 0;
    if (this.selRec.ma12302_Border == null) this.selRec.ma12302_Border = 0;
  }
}

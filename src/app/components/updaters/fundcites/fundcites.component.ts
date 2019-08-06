import { ConfirmDialogService } from './../../../dialog/confirm-dialog/confirm-dialog.service';
import { CommService } from './../../../services/comm.service';
import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DatastoreService } from 'src/app/services/datastore.service';
import { DataService } from 'src/app/services/data.service';
import { Fundtype } from 'src/app/models/fundtype';

@Component({
  selector: 'app-fundcites',
  templateUrl: './fundcites.component.html',
  styleUrls: ['./fundcites.component.css']
})
export class FundcitesComponent implements OnInit {

  @Input() public isNewRecord:boolean;
  
  //Data providers
  selRec: any = {};
  chgArr: string[] = [];
  fundtypes: Fundtype[] = [];

  //Form Validators
  fundcodeControl = new FormControl('', [Validators.required]);
  fundeffdateControl = new FormControl('', [Validators.required]);
  cicControl = new FormControl('', [Validators.required]);
  mdcControl = new FormControl('', [Validators.required]);
  fy1Control = new FormControl('', [Validators.required]);
  fy2Control = new FormControl('', [Validators.required]);
  fy3Control = new FormControl('', [Validators.required]);
  fyControl = new FormControl('', [Validators.required]);
  bsnControl = new FormControl('', [Validators.required]);
  limitControl = new FormControl('', [Validators.required]);
  oaControl = new FormControl('', [Validators.required]);
  asnControl = new FormControl('', [Validators.required]);
  eorControl = new FormControl('', [Validators.required]);
  mdepControl = new FormControl('', [Validators.required]);
  fccControl = new FormControl('', [Validators.required]);
  amsControl = new FormControl('', [Validators.required]);
  statusidControl = new FormControl('', [Validators.required]);
  apcControl = new FormControl('', [Validators.required]);
  fsnControl = new FormControl('', [Validators.required]);
  fundtypeControl = new FormControl('', [Validators.required]);
 
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
    this.fundtypes = this.ds.opsData["fundtypes"];
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

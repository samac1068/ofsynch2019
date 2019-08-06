import { ConfirmDialogService } from './../../../dialog/confirm-dialog/confirm-dialog.service';
import { CommService } from './../../../services/comm.service';
import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DatastoreService } from 'src/app/services/datastore.service';
import { DataService } from 'src/app/services/data.service';
import { Country } from 'src/app/models/country';
import { States } from 'src/app/models/states';

@Component({
  selector: 'app-missionlocation',
  templateUrl: './missionlocation.component.html',
  styleUrls: ['./missionlocation.component.css']
})
export class MissionlocationComponent implements OnInit {

  @Input() public isNewRecord:boolean;
  
  //Data providers
  selRec: any = {};
  chgArr: string[] = [];
  country: Country[] = [];
  states: States[] = [];

  //Form Validators
  locationControl = new FormControl('', [Validators.required]);
  displayControl = new FormControl('', [Validators.required]);
  countryControl = new FormControl('', [Validators.required]);
  stateControl = new FormControl('', [Validators.required]);
  zipcodeControl = new FormControl('', [Validators.required]);
  installationControl = new FormControl('', [Validators.required]);
  geolocControl = new FormControl('', [Validators.required]);
  geocoordControl = new FormControl('', [Validators.required]);
  latitudeControl = new FormControl('', [Validators.required]);
  longitudeControl = new FormControl('', [Validators.required]);

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
    this.country = this.ds.opsData["country"];
    this.states = this.ds.opsData["states"];
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

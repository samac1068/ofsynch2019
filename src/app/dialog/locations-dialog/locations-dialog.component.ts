import { Component, OnInit } from '@angular/core';
import { DatastoreService } from '../../services/datastore.service';
import { DataService } from '../../services/data.service';
import { MatDialogRef } from '@angular/material';
import { ConfirmDialogService } from '../confirm-dialog/confirm-dialog.service';
import { CommService } from '../../services/comm.service';

@Component({
  selector: 'app-locations-dialog',
  templateUrl: './locations-dialog.component.html',
  styleUrls: ['./locations-dialog.component.css']
})

export class LocationsDialogComponent implements OnInit {

    //locations: any = [];
    searched: boolean = false;

    searchTxt: string;
    searchExist: any = [];
    searchPoss: any = [];
    locationSelected: any [];

    constructor(private ds: DatastoreService, private data: DataService, public dialogRef: MatDialogRef<LocationsDialogComponent>,
                private cds: ConfirmDialogService, private comm: CommService) { }

    ngOnInit() {
        //this.updateDataLoad();
    }

    updateDataLoad() {
        //this.locations = this.ds.opsData["missionlocations"];
    }

    resetSearch() {
        // Reset the original search and shrink the form
        this.searchTxt = '';
        this.searched = false;
        this.locationSelected = [];
        this.searchExist = [];
        this.searchPoss = [];

    }

    closeSearch() {
        this.dialogRef.close();
        console.log("The mission location search window has been closed.");
    }

    executeSearch() {
        this.searchExist = [];
        this.searchPoss = [];

        this.searched = false;

        this.getLocationData();
    }

    getLocationData() {
        this.data.searchMissionLocation(this.searchTxt).subscribe((results) => {
            this.searchExist = results;

            //Now retrieve all possibles
            this.data.searchGeoLocation(this.searchTxt).subscribe((results) => {
                this.searchPoss = results;
                this.searched = true;
            });
        });
    }

    recordSelected(row) {
        // Search and make sure we don't have it then add otherwise remove
        //locationSelected

    }

    addSelectedLocations() {

    }
}

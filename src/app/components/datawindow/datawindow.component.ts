import {DataService} from '../../services/data.service';
import {CommService} from '../../services/comm.service';
import {DatastoreService} from '../../services/datastore.service';
import {Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {MatDialog, MatDialogRef} from '@angular/material';
import {OperationDialogComponent} from 'src/app/dialog/operation-dialog/operation-dialog.component';
import {LocationsDialogComponent} from 'src/app/dialog/locations-dialog/locations-dialog.component';

@Component({
    selector: 'app-datawindow',
    templateUrl: './datawindow.component.html',
    styleUrls: ['./datawindow.component.css']
})

export class DatawindowComponent implements OnInit {
    @ViewChild('rightcol', {static: false}) rightcol: ElementRef;

    dgData: any = []; // Currently loaded information
    dgDataRaw: any = []; // Contains the displayed list of information and is used to reset back to norm before a filter is applied
    localPamams: any;
    colHeadData: string[] = [];
    colDefaults;
    showEditor = false;  // Display the edit panel or hide it.  Default is hidden
    availWidth: number;
    isNewRecord = false;
    subOpList: string [];
    curOperation: string;
    allDataLoaded = false;
    operationDialogRef: MatDialogRef<OperationDialogComponent>;
    locationDialogRef: MatDialogRef<LocationsDialogComponent>;

    constructor(private ds: DatastoreService, private comm: CommService, private data: DataService, private spinner: NgxSpinnerService,
                private dialog: MatDialog, private cdRef: ChangeDetectorRef) {
    }

    ngOnInit() {
        // Confirm that we have the confirmed location for the API

        // Load the column headers
        this.ds.columnHeaders = this.data.getColumnData();
        this.colDefaults = { resizable: true, sortable: false, editable: false };

        // Subscriptions
        this.comm.navbarClicked.subscribe(() => {
            this.curOperation = this.ds.curSelectedButton;
            this.showEditor = false;
            this.isNewRecord = false;
            this.loadSelectedButton();
        });

        // Canceled clicked
        this.comm.cancelRecClicked.subscribe(() => {
            this.isNewRecord = false;
            this.showEditor = false;
        });

        // Reload of Datagrid signaled
        this.comm.signalReload.subscribe(() => {
            this.showEditor = false;
            this.getSelectedOperationData(false);
        });

        //Cog was clicked
        this.comm.cogClicked.subscribe((results) => {
          console.log("Passed To Edit Window", results);
          this.editRecordHandler(results);
        });
    }

    // tslint:disable-next-line:ban-types
    async getSelectedOperationData(isMulti: Boolean) {
        this.showLoaderAni();
        await this.data.getOperationData()
            .subscribe((results) => {
                this.dgData = results; // Load the returning data to be displayed
                this.dgDataRaw = results;
                this.ds.opsData[this.ds.curSelectedButton] = this.dgData;
                this.colHeadData = this.ds.columnHeaders[this.ds.curSelectedButton]; // Load the list of column headers for the selected operation

                this.hideLoaderAni();
            });

        this.cdRef.detectChanges();
        this.availWidth = this.rightcol.nativeElement.offsetWidth;
        this.setTableResize();
    }

    onGridReady(params) {
         this.localPamams = params;
    }

    loadSelectedButton() {
        this.getSelectedOperationData(true);

        // Load the necessary sub-operation information for the selected operation
        switch (this.ds.curSelectedButton) {
            case 'damps':
                this.subOpList = ['pay', 'tcs', 'conusa', 'operations', 'cycles'];
                break;
            case 'orders':
                this.subOpList = ['operations', 'cycles', 'damps'];
                break;
            case 'pay':
                this.subOpList = ['record', 'transfer'];
                break;
            case 'tcs':
                this.subOpList = ['geoloc'];
                break;
            case 'conusa':
                this.subOpList = [];
                break;
            case 'missionlocations':
                this.subOpList = ['country', 'states'];
                break;
            case 'fundcites':
                this.subOpList = ['fundtypes'];
                break;
            case 'operations':
                this.subOpList = ['missionlocations', 'missionAssign', 'locationid', 'command'];
                break;
            case 'tpfdd':
                this.subOpList = ['operations'];
                break;
            case 'cycles':
                this.subOpList = [];
                break;
        }

        // Grab the support data for the selected operation button
        this.getSubOpData(this.subOpList);
    }

    getSubOpData(operation: string []) {
        let loopCount = 0;
        // tslint:disable-next-line:triple-equals
        if (operation != null) {
            operation.forEach((obj) => {
                this.data.getSubOperationData(obj).subscribe((results) => {
                    this.ds.opsData[obj] = results;
                    loopCount++;
                });
            });
        }
    }

    hideLoaderAni() {
        this.spinner.hide();
        this.allDataLoaded = true;
    }

    showLoaderAni() {
        this.allDataLoaded = false;
        this.spinner.show();
    }

    /*sepClickHandler() {
        this.showEditor = !this.showEditor;
    }*/

    setTableResize() {
        let totWidth = 0;
        this.ds.columnHeaders[this.ds.curSelectedButton].forEach((column) => {
            totWidth += column.width;
        });

        const scale = (this.availWidth - 5) / totWidth;
        this.ds.columnHeaders[this.ds.curSelectedButton].forEach((column) => {
            column.width *= scale;
            this.setColumnWidth(column);
        });
    }

    setColumnWidth(column: any) {
        const columnEls = Array.from(document.getElementsByClassName('mat-column-' + column.columnDef));
        columnEls.forEach((el: HTMLDivElement) => {
            el.style.width = column.width + 'px';
        });
    }

    public trackByIndex(index: number, value: any) {
        return index;
    }

    createNewRecordHandler() {
        if (this.ds.curSelectedButton == 'missionlocations') { // Show new location entry window
            this.showEditor = false;
            this.locationDialogRef = this.dialog.open(LocationsDialogComponent, {panelClass: 'locationDialogClass'});
        } else {   // Show standard new item entry window
            this.isNewRecord = true;
            this.showEditor = true;
            this.comm.createNewClicked.emit();
        }
    }

    editRecordHandler(selectedRow: any) {
        this.ds.curSelectedRecord = selectedRow;
        this.isNewRecord = false;

        // tslint:disable-next-line:triple-equals
        if (this.ds.curSelectedButton == 'operations') {     // Show Unique Operations Window
            this.showEditor = false;
            this.operationDialogRef = this.dialog.open(OperationDialogComponent, {height: '730px', width: '620px'});
        } else {    // Show standard window
            this.showEditor = true;
            this.comm.editRecClicked.emit();
        }
    }
}

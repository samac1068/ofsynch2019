import { DataService } from './../../services/data.service';
import { CommService } from './../../services/comm.service';
import { DatastoreService } from './../../services/datastore.service';
import { Component, OnInit, ViewChild, ElementRef, HostListener, Renderer2, Input, ViewChildren } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-datawindow',
  templateUrl: './datawindow.component.html',
  styleUrls: ['./datawindow.component.css']
})

export class DatawindowComponent implements OnInit {
  @ViewChild('rightcol', {static: false}) rightcol: ElementRef;
   
  dgData: any = []; //Currently loaded information
  colData: any = []; //current column list
  colWidthData: string[] = [];
  colHeadData: string[] = [];
  showEditor: boolean = false;  //Display the edit panel or hide it.  Default is hidden
  availWidth: number; 
  isNewRecord: boolean = false;
  subOpList: string [];
  curOperation: string;
  allDataLoaded: boolean = false;
  
 constructor(private ds: DatastoreService, private comm: CommService, private data:DataService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.data.getColumnData().subscribe((results) => { //Initiator
      for(var i = 0; i < this.ds.btnData.length; i++) {
        if(results[this.ds.btnData[i][0]] != undefined && results[this.ds.btnData[i][0]] != null){
          for(var k =0; k < results[this.ds.btnData[i][0]].length; k++)
          {
            if(!results[this.ds.btnData[i][0]][k]['hidden'])
              this.ds.columnHeaders[this.ds.btnData[i][0]] = results[this.ds.btnData[i][0]];
          }
        }
        else
        {
           if(this.ds.curSelectedButton != "" && this.ds.curSelectedButton != undefined)
             alert("Unable to retrieve the column headers for the selected operation.  Please confirm dg-columns.json");
        }
      }
    });

    //Subscriptions
    this.comm.navbarClicked.subscribe(() => {
      this.allDataLoaded = false;
      this.curOperation = this.ds.curSelectedButton;
      this.showEditor = false;
      this.isNewRecord = false;
      this.loadSelectedButton()
    });

    // Canceled clicked
    this.comm.cancelRecClicked.subscribe(() => {
      this.isNewRecord = false;
      this.showEditor = false;
    });

    //Reload of Datagrid signaled
    this.comm.signalReload.subscribe(() => {
      this.showEditor = false;
      this.reloadSelectedOperation();
    });
  }

  //Function Handler
  loadSelectedButton() {
    this.spinner.show();  // Display the Loading animation
    this.data.getOperationData().subscribe((results) => {
      // Load the returning data to be displayed
      this.dgData = results
      this.ds.opsData[this.ds.curSelectedButton] = this.dgData; //results;
      
      // Load the list of column headers for the selected operation
      this.colHeadData = this.ds.columnHeaders[this.ds.curSelectedButton];
    });
    
    this.availWidth = this.rightcol.nativeElement.offsetWidth;
    this.setTableResize();

    //Load the necessary suboperation information for the selected operation
    switch(this.ds.curSelectedButton){
      case "damps":
        this.subOpList = ["pay","tcs","conusa","operations","cycles"];
        break;
      case "orders":
        this.subOpList = ["operations","cycles","damps"];
        break;
      case "pay":
        this.subOpList = [];
        break;
      case "tcs":
        this.subOpList = [];
        break;
      case "conusa":
        this.subOpList = [];
        break;
      case "missionlocation":
        this.subOpList = ["country","states"];
        break;
      case "fundcites":
        this.subOpList = ["fundtypes"];
        break;
      case "operations":
        this.subOpList = [];
        break;
      case "tpfdd":
        this.subOpList = ["operations"];
        break;
      case "cycles":
        this.subOpList = [];
        break;
    }
    
    // Grab the support data for the selected operation button
    this.getSubOpData(this.subOpList);
  }
  
  getSubOpData(operation: string []){
    if(operation != null && operation != undefined) {
      operation.forEach((obj) => {
        this.data.getSubOperationData(obj).subscribe((results) => {
          this.ds.opsData[obj] = results;
        });
      });
    }
  }

  reloadSelectedOperation(){
    this.spinner.show();  // Display the Loading animation
    this.data.getOperationData().subscribe((results) => {
      // Load the returning data to be displayed
      this.dgData = results;
      this.ds.opsData[this.ds.curSelectedButton] = results;
      
      // Load the list of column headers for the selected operation
      this.colHeadData = this.ds.columnHeaders[this.ds.curSelectedButton];
    });
    
    this.availWidth = this.rightcol.nativeElement.offsetWidth;
    this.setTableResize();
  }

  handleLoaderAni(){
    this.spinner.hide();
    this.allDataLoaded = true;
  }

  showLoaderAni() {
    this.spinner.show();
    this.allDataLoaded = false;
  }

  sepClickHandler() {
    this.showEditor = !this.showEditor;
  }

  setTableResize() {
    let totWidth = 0;
    this.ds.columnHeaders[this.ds.curSelectedButton].forEach(( column ) => {
      totWidth += column.width;

    });

    const scale = (this.availWidth - 5) / totWidth;
    this.ds.columnHeaders[this.ds.curSelectedButton].forEach(( column ) => {
      column.width *= scale;
      this.setColumnWidth(column);
    });
  }

  setColumnWidth(column: any) {
    const columnEls = Array.from( document.getElementsByClassName( "mat-column-" + column.columnDef ));
    columnEls.forEach(( el: HTMLDivElement ) => {
      el.style.width = column.width + 'px';
    });
  }

  applyFilter(filterValue: string) {
    var table, tr, td, i, txtValue, found;

    table = document.getElementById("opDataTbl");
    tr = table.getElementsByTagName("tr");

    for (i = 1; i < tr.length; i++) {
      found = false;
      td = tr[i].getElementsByTagName("td");  
      for (var j = 0; j < td.length; j++) {
        if(td[j]){
          txtValue = td[j].textContent || td[j].innerText;
          if (txtValue.toUpperCase().indexOf(filterValue.toUpperCase()) > -1) {
            found = true;
            break;
          }
        }
      }
      
      // Set the display based on the results.
      tr[i].style.display = (!found) ? "none" : "";
    }
  }
  
  createNewRecordHandler() {
    this.isNewRecord = true;
    this.showEditor = true;
    this.comm.createNewClicked.emit();
  }

  editRecordHandler(selectedRow: any) {
    this.ds.curSelectedRecord = selectedRow;
    this.isNewRecord = false;
    this.showEditor = true;
    this.comm.editRecClicked.emit();
  }
}

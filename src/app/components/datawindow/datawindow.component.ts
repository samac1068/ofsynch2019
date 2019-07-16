import { DataService } from './../../services/data.service';
import { CommService } from './../../services/comm.service';
import { DatastoreService } from './../../services/datastore.service';
import { Component, OnInit, ViewChild, ElementRef, HostListener, Renderer2 } from '@angular/core';

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
  //selectColumns: any[] = [];
  isNewRecord: boolean = false;
  //manualColumns: any [];
  subOpList: string [];
  curOperation: string;

 constructor(private ds: DatastoreService, private comm: CommService, private data:DataService) { }

  ngOnInit() {
    this.data.getColumnData().subscribe((results) => { //Initiator
      for(var i = 0; i < this.ds.btnData.length; i++) {
        if(results[this.ds.btnData[i]] != undefined && results[this.ds.btnData[i]] != null){
          for(var k =0; k < results[this.ds.btnData[i]].length; k++)
          {
            if(!results[this.ds.btnData[i]][k]['hidden'])
              this.ds.columnHeaders[this.ds.btnData[i]] = results[this.ds.btnData[i]];
          }
        }
      }
    });

    //Subscriptions
    this.comm.navbarClicked.subscribe(() => {
      this.curOperation = this.ds.curSelectedButton;
      this.data.getOperationData().subscribe((results) => {
        // Load the returning data to be displayed
        this.dgData = results;
        this.ds.opsData[this.ds.curSelectedButton] = results;
        
        // Load the list of column headers for the selected operation
        this.colHeadData = this.ds.columnHeaders[this.ds.curSelectedButton];
      });
      
      this.availWidth = this.rightcol.nativeElement.offsetWidth;
      this.setTableResize();

      //Load the necessary suboperation information for the selected operation
      switch(this.ds.curSelectedButton){
        case "damps":
          this.subOpList = ["pay","tcs","conusa","operations","cycle"];
          break;
        case "orders":
          this.subOpList = ["operations","cycle","damps"];
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
          this.subOpList = ["country","status"];
          break;
        case "fundcites":
          this.subOpList = ["fundtype"];
          break;
        case "operations":
          this.subOpList = [];
          break;
        case "tpfdd":
          this.subOpList = ["opeartions", "tpfdd"];
          break;
        case "cycles":
          this.subOpList = [];
          break;
      }
      
      // Grab the support data for the selected operation button
      this.getSubOpData(this.subOpList);
    });

    // Canceled clicked
    this.comm.cancelRecClicked.subscribe(() => {
      this.isNewRecord = false;
      this.showEditor = false;
    });
  }

  //Function Handler
  getSubOpData(operation: string []){
    if(operation != null && operation != undefined) {
      operation.forEach((obj) => {
        this.data.getSubOperationData(obj).subscribe((results) => {
          this.ds.opsData[obj] = results;
        });
      });
    }
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

  editRecordHandler(id: number) {
    this.ds.curSelectedRecord = this.ds.getSelectedRow(this.dgData, id);
    this.isNewRecord = false;
    this.showEditor = true;
    this.comm.editRecClicked.emit();
  }
}

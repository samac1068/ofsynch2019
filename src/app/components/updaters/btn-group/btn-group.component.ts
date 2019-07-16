import { CommService } from './../../../services/comm.service';
import { Component, OnInit, Input } from '@angular/core';
import { DatastoreService } from 'src/app/services/datastore.service';

@Component({
  selector: 'app-btn-group',
  templateUrl: './btn-group.component.html',
  styleUrls: ['./btn-group.component.css']
})
export class BtnGroupComponent implements OnInit {
  @Input() isNewRecord: boolean;
  
  activeLabel: string = "Update";

  constructor(private comm: CommService) { }

  ngOnInit() {
    this.activeLabel = (this.isNewRecord) ? "Insert" : "Update";
  }

  cancelHandler(){
    this.comm.cancelRecClicked.emit();
  }

  submitHandler(){
    this.comm.submitRecClicked.emit();
  }
}

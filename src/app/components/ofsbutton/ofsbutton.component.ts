import { Component, OnInit, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'ofsbutton',
  templateUrl: './ofsbutton.component.html',
  styleUrls: ['./ofsbutton.component.css']
})
export class OfsbuttonComponent implements OnInit {

  //Passed Parameters
  @Input() label: string;
  @Input() tooltip: string;
  @Input() imgname: string;
  @Input() width: number;

  @Output() btnClickEvt = new EventEmitter();

  imgPath: string;
  bgColorArr: string[] = ["#66903B", "#395E13", "#786643"];
  txtColorArr: string[] = ["#FFFFFF", "#FFFF00"];
  txtIndex: number = 0;
  toggle: boolean = false;

  constructor() { }

  ngOnInit() {
    this.imgPath = `../../../assets/images/${this.imgname}.png`;
  }

  handleMouseDown(){
    this.toggle = true;
  }

  handleMouseUp(){
    this.toggle = false;
    this.btnClickEvt.emit(this.label.toLowerCase().replace(" ", ""));
  }

  handleMouseOver(){
    this.txtIndex = 1;
  }

  handleMouseOut() {
    this.txtIndex = 0;
  }

  buttonShift(): Object{
    if(this.txtIndex == 1 && !this.toggle)
      return {'background-color': this.bgColorArr[1]};


    if(this.toggle)
      return {'margin-left': '2px', 'margin-top': '7px', 'background-color' : this.bgColorArr[2]};
    else
      return {'margin-left': '0', 'margin-top': '5px', 'background-color': this.bgColorArr[0]};
  }
}

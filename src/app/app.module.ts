import { DatastoreService } from './services/datastore.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BannerComponent } from './components/banner/banner.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { OfsbuttonComponent } from './components/ofsbutton/ofsbutton.component';
import { DatawindowComponent } from './components/datawindow/datawindow.component';
import { CommService } from './services/comm.service';
import { DataService } from './services/data.service';
import { HttpClientModule } from '@angular/common/http';
import { AgGridModule } from 'ag-grid-angular';

//Angular Material 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UpdatePanelComponent } from './components/update-panel/update-panel.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { DampsComponent } from './components/updaters/damps/damps.component';
import { MatCardModule } from '@angular/material/card';
import { BtnGroupComponent } from './components/updaters/btn-group/btn-group.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    BannerComponent,
    NavbarComponent,
    OfsbuttonComponent,
    DatawindowComponent,
    UpdatePanelComponent,
    DampsComponent,
    BtnGroupComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AgGridModule.withComponents(null),
    BrowserAnimationsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatCardModule,
    FormsModule
  ],
  providers: [
    DatastoreService,
    CommService,
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

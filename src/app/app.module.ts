import {DatastoreService} from './services/datastore.service';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {FormsModule} from '@angular/forms';

// App Components
import {AppComponent} from './app.component';
import {BannerComponent} from './components/banner/banner.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {OfsbuttonComponent} from './components/ofsbutton/ofsbutton.component';
import {DatawindowComponent} from './components/datawindow/datawindow.component';
import {OrdersComponent} from './components/updaters/orders/orders.component';
import {PayComponent} from './components/updaters/pay/pay.component';
import {TcsComponent} from './components/updaters/tcs/tcs.component';
import {ConusaComponent} from './components/updaters/conusa/conusa.component';
import {MissionlocationComponent} from './components/updaters/missionlocation/missionlocation.component';
import {FundcitesComponent} from './components/updaters/fundcites/fundcites.component';
import {OperationsComponent} from './components/updaters/operations/operations.component';
import {TpfddComponent} from './components/updaters/tpfdd/tpfdd.component';
import {BtnGroupComponent} from './components/updaters/btn-group/btn-group.component';
import {ConfirmDialogComponent} from './dialog/confirm-dialog/confirm-dialog.component';
import {CyclesComponent} from './components/updaters/cycles/cycles.component';
import {OperationDialogComponent} from './dialog/operation-dialog/operation-dialog.component';
import {LocationsDialogComponent} from './dialog/locations-dialog/locations-dialog.component';

// Services
import {CommService} from './services/comm.service';
import {DataService} from './services/data.service';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {AgGridModule} from 'ag-grid-angular';
import {AuthInterceptorService} from './services/auth-interceptor.service';

//Angular Material 
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {UpdatePanelComponent} from './components/update-panel/update-panel.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {ReactiveFormsModule} from '@angular/forms';
import {DampsComponent} from './components/updaters/damps/damps.component';
import {MatCardModule} from '@angular/material/card';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatExpansionModule} from '@angular/material/expansion';

// 3rd Party Items
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgxSpinnerModule} from 'ngx-spinner';
import {AngularDualListBoxModule} from 'angular-dual-listbox';

// AgGrid
import { AGCheckBoxRendererComponent } from './components/renderers/AGCheckBoxRendererComponent'
import {AGEditIconRendererComponent} from './components/renderers/AGEditIconRendererComponent';



@NgModule({
    declarations: [
        AppComponent,
        BannerComponent,
        NavbarComponent,
        OfsbuttonComponent,
        DatawindowComponent,
        UpdatePanelComponent,
        BtnGroupComponent,
        ConfirmDialogComponent,
        DampsComponent,
        OrdersComponent,
        PayComponent,
        TcsComponent,
        ConusaComponent,
        MissionlocationComponent,
        FundcitesComponent,
        OperationsComponent,
        TpfddComponent,
        CyclesComponent,
        OperationDialogComponent,
        LocationsDialogComponent,
        AGCheckBoxRendererComponent,
        AGEditIconRendererComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AgGridModule.withComponents([AGCheckBoxRendererComponent, AGEditIconRendererComponent]),
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
        MatDatepickerModule,
        MatNativeDateModule,
        MatExpansionModule,
        FormsModule,
        NgbModule,
        NgxSpinnerModule,
        AngularDualListBoxModule
    ],
    providers: [
        DatastoreService,
        CommService,
        DataService,
        Location,
        {provide: LocationStrategy, useClass: PathLocationStrategy},
        {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}
    ],
    entryComponents: [ConfirmDialogComponent, OperationDialogComponent, LocationsDialogComponent],
    bootstrap: [AppComponent]
})
export class AppModule {
}

import { NgModule } from '@angular/core';

// componentes
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GridwbComponent } from './gridwb/gridwb.component';
import { MessageComponent} from './message/message.component';

// importamos lo necesario para acceder a firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule} from '@angular/fire/database';
import { environment } from '../environments/environment';

// otros modulos
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { LayoutModule } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { FlexLayoutModule} from '@angular/flex-layout';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { DashboardComponent } from './dashboard/dashboard.component';
import { MinoderedComponent } from './minodered/minodered.component';
import { SafePipe } from './safe.pipe';
import { UserbarComponent } from './userbar/userbar.component';
import { MatTabsModule} from '@angular/material/tabs';
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    AppComponent,
    GridwbComponent,
    MessageComponent,
    DashboardComponent,
    MinoderedComponent,
    SafePipe,
    UserbarComponent
  ],
    imports: [
        AppRoutingModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireDatabaseModule,
        MatGridListModule,
        MatCardModule,
        MatIconModule,
        MatButtonToggleModule,
        BrowserAnimationsModule,
        MatSliderModule,
        MatToolbarModule,
        MatSidenavModule,
        MatListModule,
        LayoutModule,
        MatButtonModule,
        MatMenuModule,
        FlexLayoutModule,
        MatDialogModule,
        MatTooltipModule,
        BrowserModule,
        HttpClientModule,
        MatTabsModule,
        MatProgressSpinnerModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

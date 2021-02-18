import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {GridwbComponent} from './gridwb/gridwb.component';
import {MinoderedComponent} from './minodered/minodered.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'gridwb', component: GridwbComponent },
  { path: 'minodered', component: MinoderedComponent },
  { path: '', redirectTo: '/gridwb', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

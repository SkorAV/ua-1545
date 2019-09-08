import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardPageModule' },
  { path: 'details/:id', loadChildren: './details/details.module#DetailsPageModule' },
  { path: 'new-appeal', loadChildren: './new-appeal/new-appeal.module#NewAppealPageModule' },
  { path: 'profile', loadChildren: './profile/profile.module#ProfilePageModule' },
  { path: 'level1', loadChildren: './new-appeal/question/level1/level1.module#Level1PageModule' },
  { path: 'level2', loadChildren: './new-appeal/question/level2/level2.module#Level2PageModule' },
  { path: 'level3', loadChildren: './new-appeal/question/level3/level3.module#Level3PageModule' },
  { path: 'level4', loadChildren: './new-appeal/question/level4/level4.module#Level4PageModule' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberRoutingModule { }

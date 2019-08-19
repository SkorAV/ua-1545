import { AuthGuard } from './guards/auth.guard';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: './public/login/login.module#LoginPageModule'
  },
  { path: 'signup/step1', loadChildren: './public/signup/step1/step1.module#Step1PageModule' },
  { path: 'signup/step2', loadChildren: './public/signup/step2/step2.module#Step2PageModule' },
  { path: 'signup/step3-fo', loadChildren: './public/signup/step3-fo/step3-fo.module#Step3FoPageModule' },
  { path: 'signup/step3-uo', loadChildren: './public/signup/step3-uo/step3-uo.module#Step3UoPageModule' },
  { path: 'signup/step4', loadChildren: './public/signup/step4/step4.module#Step4PageModule' },
  {
    path: 'members',
    canActivate: [AuthGuard],
    loadChildren: './members/member-routing.module#MemberRoutingModule'
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

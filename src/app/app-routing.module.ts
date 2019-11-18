import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import Welcome from './pages/welcome/welcome.module';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/welcome' ,},
  { path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule) },
  // { path: 'welcome', component: Welcome }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

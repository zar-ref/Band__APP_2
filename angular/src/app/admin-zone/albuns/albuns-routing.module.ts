import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Componentes
import{ AlbunsComponent } from './albuns.component'
import { EditComponent } from './edit/edit.component'
import { CreateComponent } from './create/create.component'
import { AdminGuard } from 'src/app/auth/admin.guard';

const routes: Routes = [

  
  {path: '' , component: AlbunsComponent ,
    children: [
        
        {path: 'edit' , component: EditComponent},
        {path: 'create' , component: CreateComponent},
        {path: '' , redirectTo: 'edit', pathMatch: 'full'}
    ]

}


];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlbunsRoutingModule { }

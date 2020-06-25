import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { AlbunsComponent } from './albuns.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import{AlbunsRoutingModule} from './albuns-routing.module'
import{AddMusicToAlbumComponent} from './edit/dialogs/add-music-to-album/add-music-to-album.component'
import {EditAlbumImageComponent} from './edit/dialogs/edit-album-image/edit-album-image.component'
import {DeleteMusicComponent} from './edit/dialogs/delete-music/delete-music.component'
import {EditAlbumNameComponent} from './edit/dialogs/edit-album-name/edit-album-name.component'
import { EditAlbumDescriptionComponent } from './edit/dialogs/edit-album-description/edit-album-description.component';
import {DeleteAlbumComponent} from './edit/dialogs/delete-album/delete-album.component'


@NgModule({
    declarations: [   
        CreateComponent, 
        EditComponent,
        AlbunsComponent,
        AddMusicToAlbumComponent,
        EditAlbumImageComponent,
        DeleteMusicComponent,
        EditAlbumNameComponent,
        EditAlbumDescriptionComponent,
        DeleteAlbumComponent
    ],
    imports: [
        ReactiveFormsModule,
        CommonModule,
        SharedModule,
        AlbunsRoutingModule
    ],
    providers: [],
    entryComponents: [
        AddMusicToAlbumComponent,
        EditAlbumImageComponent,
        DeleteMusicComponent,
        EditAlbumNameComponent,
        EditAlbumDescriptionComponent,
        DeleteAlbumComponent
    ]
  })
  export class AlbunsModule { }
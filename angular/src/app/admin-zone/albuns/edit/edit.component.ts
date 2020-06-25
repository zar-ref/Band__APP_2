import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlbunsService } from '../albuns.service';
import {AlbumData} from '../album-data.model'
import { saveAs} from 'file-saver';
import { Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material';
import { AddMusicToAlbumComponent } from './dialogs/add-music-to-album/add-music-to-album.component';
import {EditAlbumImageComponent} from './dialogs/edit-album-image/edit-album-image.component'
import {DeleteMusicComponent} from './dialogs/delete-music/delete-music.component'
import{EditAlbumNameComponent} from './dialogs/edit-album-name/edit-album-name.component'
import {EditAlbumDescriptionComponent} from './dialogs/edit-album-description/edit-album-description.component'
import{DeleteAlbumComponent} from './dialogs/delete-album/delete-album.component'

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {

  albuns: AlbumData[] = []
  numberOfAlbuns: number;
  isLoading = false;
  private albunsSub : Subscription;
  lastMusicIndex: number
  constructor(private albunsService: AlbunsService,  private matDialog:MatDialog , private sanitizer: DomSanitizer    ) { }

  ngOnInit() {
    this.isLoading = true;
    this.albunsService.getAlbuns()
    this.albunsSub = this.albunsService.albuns.subscribe(albuns => {
      if(albuns){
        this.albuns = albuns
        this.isLoading = false
      }else {
        this.isLoading = false
      }
     
    })
  }
  
  getSantizeUrl(url : string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  getLinks(albumId:number , file: string, albumPath: string){
    const link = environment.webUrl + 'albunsfiles/' + albumId.toString() + "/" + file;
    return this.getSantizeUrl(link);
  }

  getDownloadLink(albumId: number, file: string){
    


    this.albunsService.downloadMusic(albumId.toString(), file)
      .subscribe(data => {
        const filename = file.split('__')[1];
        saveAs(data, filename);
      },
      err =>{
        console.log(err);
      });
  }


  ////DIALOGS
  showAddMusicToAlbumDialog(albumId: number, albumName: string, musicsInAlbum: string[]){
    const dialogRef = this.matDialog.open( AddMusicToAlbumComponent, {
      width: '550px',
      height: '280px',
      data: {albumId: albumId, albumName: albumName , musicsInAlbum: musicsInAlbum}
    });
  }

  showChangeAlbumCoverDialog(albumId: number, albumName: string, albumImgUrl: string){

    const dialogRef = this.matDialog.open( EditAlbumImageComponent, {
      width: '550px',
      height: '280px',
      data: {albumId: albumId, albumName: albumName , albumImgUrl: albumImgUrl}
    });
  }

  showDeleteMusicDialog(albumId: number, albumName: string, musicUrl: string){

    const dialogRef = this.matDialog.open( DeleteMusicComponent , {
      width: '550px',
      height: '280px',
      data: {albumId: albumId, albumName: albumName , musicUrl: musicUrl}
    });
  }

  showChangeAlbumDescriptionDialog(albumId: number, albumName: string, albumDescription: string){

    const dialogRef = this.matDialog.open( EditAlbumDescriptionComponent , {
      width: '550px',
      height: '480px',
      data: {albumId: albumId, albumName: albumName , albumDescription: albumDescription}
    });
  }

  showEditAlbumNameDialog(albumId: number, albumName: string){

    const dialogRef = this.matDialog.open( EditAlbumNameComponent , {
      width: '550px',
      height: '280px',
      data: {albumId: albumId, albumName: albumName }
    });
  }


  showDeleteAlbum(albumId: number,albumName: string) {
    const dialogRef = this.matDialog.open( DeleteAlbumComponent, {
      width: '550px',
      height: '80px',
      data: {albumId: albumId, albumName: albumName}
    });
  }

  


  ngOnDestroy(){
    this.albunsSub.unsubscribe();
  }

}

import { Component, OnInit, Inject, OnDestroy} from '@angular/core';
import{MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import {AlbunsService} from '../../../albuns.service'
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-delete-music',
  templateUrl: './delete-music.component.html',
  styleUrls: ['./delete-music.component.scss']
})
export class DeleteMusicComponent implements OnInit, OnDestroy {

  public isLoading = false;
  private deleteMusicSubs: Subscription
  constructor(
    public dialogRef: MatDialogRef<DeleteMusicComponent>,
    private albunsService: AlbunsService, 
    @Inject(MAT_DIALOG_DATA) public data: {albumId: string, albumName: string , musicUrl: string}
  ) { }

  ngOnInit() {
    console.log(this.data)
  }


  exitDeleteMusicDialog(){
    this.dialogRef.close()
  }

  deleteMusic(albumId: number, musicToDelete: string){

    this.isLoading = true
    const deleteMusicObs: Observable<string> = this.albunsService.deleteFile(this.data.albumId, this.data.musicUrl)
    this.deleteMusicSubs = deleteMusicObs
      .subscribe(response => {
        this.isLoading = false;
        this.albunsService.getAlbuns()
        this.exitDeleteMusicDialog()
      },err => {
        console.log(err);
        this.isLoading = false;
        this.exitDeleteMusicDialog()
      })
    
    }

    ngOnDestroy(){
      if(this.deleteMusicSubs){
        this.deleteMusicSubs.unsubscribe()
    }
    }
}

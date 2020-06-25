import { Component, OnInit, Inject, OnDestroy  } from '@angular/core';
import{MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { Subscription, Observable } from 'rxjs';
import{AlbunsService} from '../../../albuns.service'
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-delete-album',
  templateUrl: './delete-album.component.html',
  styleUrls: ['./delete-album.component.scss']
})
export class DeleteAlbumComponent implements OnInit, OnDestroy {

  public isLoading = false;
  private subscription: Subscription


  constructor(
    public dialogRef: MatDialogRef<DeleteAlbumComponent>,
    private albunsService: AlbunsService, 
    @Inject(MAT_DIALOG_DATA) public  data: {albumId: string, albumName: string}
  ) { }

  ngOnInit() {

  }

  exitDeleteAlbum(){
    this.dialogRef.close()
  }

  deleteAlbum(){
    this.isLoading = true;
    const deleteAlbumObs: Observable<string> = this.albunsService.deleteAlbum(this.data.albumId);
    this.subscription = deleteAlbumObs
      .subscribe(message => {
        this.isLoading = false;
        this.albunsService.getAlbuns();
        this.exitDeleteAlbum()
      }, err => {
        this.isLoading = false;
        console.log(err);
        this.exitDeleteAlbum()
      })
  }

  ngOnDestroy(){
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }
}

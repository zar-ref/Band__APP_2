import { Component, OnInit, Inject, OnDestroy  } from '@angular/core';
import{MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { Subscription, Observable } from 'rxjs';
import{AlbunsService} from '../../../albuns.service'
import { FormGroup, FormControl, Validators } from '@angular/forms';



@Component({
  selector: 'app-edit-album-description',
  templateUrl: './edit-album-description.component.html',
  styleUrls: ['./edit-album-description.component.scss']
})
export class EditAlbumDescriptionComponent implements OnInit, OnDestroy {

  public isLoading = false;
  newAlbumDescriptionForm: FormGroup
  submitted = false;
  private subscription: Subscription

  constructor(
    public dialogRef: MatDialogRef<EditAlbumDescriptionComponent>,
    private albunsService: AlbunsService, 
    @Inject(MAT_DIALOG_DATA) public data: {albumId: string, albumName: string, albumDescription: string}
  ) { }

  ngOnInit() {
    this.newAlbumDescriptionForm = new FormGroup({
      'newDescription': new FormControl(null, [Validators.required ]),
  });
  }


  exitEditAlbumDescription(){
    this.dialogRef.close()
  }

  onSubmit(){
    this.isLoading = true;
    this.submitted = true;
    if(this.newAlbumDescriptionForm.invalid){
      this.isLoading = false;
      return;
    }
    const newAlbumDescription = this.newAlbumDescriptionForm.get('newDescription').value;
    const changeAlbumDescriptionObs: Observable<string> = this.albunsService.updateAlbumDescription(this.data.albumId , newAlbumDescription)
    this.subscription = changeAlbumDescriptionObs
      .subscribe(message => {
        this.isLoading = false;
        this.albunsService.getAlbuns();
        this.exitEditAlbumDescription()
      }, err => {
        this.isLoading = false;
        console.log(err);
        this.exitEditAlbumDescription()
      })
  }

  ngOnDestroy(){
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }


}

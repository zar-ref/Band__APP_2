import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import{MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { Subscription, Observable } from 'rxjs';
import{AlbunsService} from '../../../albuns.service'
import { FileData} from '../../../album-data.model';
import { FormGroup, FormControl, Validators} from '@angular/forms';




@Component({
  selector: 'app-edit-album-image',
  templateUrl: './edit-album-image.component.html',
  styleUrls: ['./edit-album-image.component.scss']
})
export class EditAlbumImageComponent implements OnInit, OnDestroy {


  isLoading = false;
  flagCorrectForm = true
  changeAlbumCoverForm: FormGroup
  submitted = false
  private deleteCoverSubscription: Subscription
  private uploadCoverSubscription: Subscription
  private imageTypes = ['jpeg', 'png'];

  constructor(
    public dialogRef: MatDialogRef<EditAlbumImageComponent>,
    private albunsService: AlbunsService, 
    @Inject(MAT_DIALOG_DATA) public data: {albumId: string, albumName: string , albumImgUrl: string}
  ) { }

  ngOnInit() {
    console.log(this.data);
    this.changeAlbumCoverForm = new FormGroup({
      'newCover': new FormGroup({
        'fileType': new FormControl(null, [Validators.required ,this.checkImgFileType.bind(this) ]),
        'fileName': new FormControl(null, [Validators.required ]),
        'file': new FormControl(null , [Validators.required ])
      })
    });
  }


  checkImgFileType(control: FormControl): {[s: string]: boolean} { 
    if(control.value){
      if(!this.imageTypes.includes( control.value)){
        return {'typeError': true};        
      }
    }    
    return null;
  }

  exitEditAlbumImage(){
    this.dialogRef.close()

  }

  handleNewAlbumPictureInput(files: FileList){ 
    const fileType = files.item(0).type.split("/")[1];
    const fileName =   files.item(0).name;
    this.changeAlbumCoverForm.get('newCover').setValue({
      'fileType': fileType,
      'fileName': fileName,
      'file': files.item(0)
    })
    
  }

  onSubmit(){
    this.isLoading = true
    this.submitted = true;
    if(this.changeAlbumCoverForm.invalid){
      this.isLoading = false;
      return
    }
   
    const deleteAlbumCoverObs: Observable<string> = this.albunsService.deleteFile(this.data.albumId, this.data.albumImgUrl)
    this.deleteCoverSubscription = deleteAlbumCoverObs
      .subscribe(response => {
          const newImg: FileData = this.changeAlbumCoverForm.get('newCover').value
          const changeAlbumCoverObs: Observable<string> = this.albunsService.uploadFile(newImg , this.data.albumId)
          this.uploadCoverSubscription = changeAlbumCoverObs
            .subscribe(response => {
              this.isLoading = false;
              this.albunsService.getAlbuns();
              this.exitEditAlbumImage();
            }, err => {
              this.isLoading = false;
              console.log(err)
              this.exitEditAlbumImage();
            })
      }, err => {
        this.isLoading = false;
        console.log(err)
        this.exitEditAlbumImage();
      })

  }


  
  ngOnDestroy(){
    if(this.deleteCoverSubscription){
      this.deleteCoverSubscription.unsubscribe();
    }
    if(this.uploadCoverSubscription){
      this.uploadCoverSubscription.unsubscribe();
    }
    
  }

}

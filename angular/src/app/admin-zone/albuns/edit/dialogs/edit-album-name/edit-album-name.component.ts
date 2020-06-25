import { Component, OnInit, Inject , OnDestroy } from '@angular/core';
import{MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { Subscription, Observable } from 'rxjs';
import{AlbunsService} from '../../../albuns.service'
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-album-name',
  templateUrl: './edit-album-name.component.html',
  styleUrls: ['./edit-album-name.component.scss']
})
export class EditAlbumNameComponent implements OnInit, OnDestroy {

  public isLoading = false;
  newAlbumNameForm: FormGroup
  submitted = false;
  private subscription: Subscription
  constructor(
    public dialogRef: MatDialogRef<EditAlbumNameComponent>,
    private albunsService: AlbunsService, 
    @Inject(MAT_DIALOG_DATA) public data: {albumId: string, albumName: string}
  ) { }





  ngOnInit() {
  console.log(this.data);
   this.newAlbumNameForm = new FormGroup({
        'newName': new FormControl(null, [Validators.required ,this.checkForNewName.bind(this) ]),
    });
   
  }

  checkForNewName(control: FormControl): {[s: string]: boolean} { 
    if(control.value){
      console.log(control.value);
      if(this.data.albumName === control.value){
        return {'sameNameError': true};        
      }
    }    
    return null;
  }

  exitEditAlbumName(){
    this.dialogRef.close()
  }




  onSubmit(){
    this.isLoading = true;
    this.submitted = true;
    if(this.newAlbumNameForm.invalid){
      this.isLoading = false;
      return;
    }
    const newAlbumName = this.newAlbumNameForm.get('newName').value;
    const changeAlbumNameObs: Observable<string> = this.albunsService.updateAlbumName(this.data.albumId , newAlbumName)
    this.subscription = changeAlbumNameObs
      .subscribe(message => {
        this.isLoading = false;
        this.albunsService.getAlbuns();
        this.exitEditAlbumName()
      }, err => {
        this.isLoading = false;
        console.log(err);
        this.exitEditAlbumName()
      })
  }

  ngOnDestroy(){
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

}

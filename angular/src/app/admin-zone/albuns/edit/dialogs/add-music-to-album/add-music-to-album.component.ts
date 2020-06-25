import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import{MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { Subscription, Observable } from 'rxjs';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import{AlbunsService} from '../../../albuns.service'
import { FileData} from '../../../album-data.model';

interface Music {
	name: string;
  filename: string;
  file: File;
}


@Component({
  selector: 'app-add-music-to-album',
  templateUrl: './add-music-to-album.component.html',
  styleUrls: ['./add-music-to-album.component.scss']
})



export class AddMusicToAlbumComponent implements OnInit, OnDestroy {

  isLoading = false;
  flagCorrectForm = true
  addMusicToAlbumForm: FormGroup
  submitted = false
  lastMusicIndex: number
  private subscription: Subscription

  constructor(
    public dialogRef: MatDialogRef<AddMusicToAlbumComponent>,
    private albunsService: AlbunsService, 
    @Inject(MAT_DIALOG_DATA) public data: {albumId: string, albumName: string , musicsInAlbum: string[]}
  ) { }



  // convenience getter for easy access to form fields
  get f() { 
    return this.addMusicToAlbumForm.controls;
  }

  ngOnInit() {
   
    try {
      this.lastMusicIndex = +this.data.musicsInAlbum[this.data.musicsInAlbum.length - 1].split('__')[0];
    } catch (error) {
      if(error)
      this.lastMusicIndex = 0;
    }
    
   
    this.addMusicToAlbumForm = new FormGroup({
      'newMusic': new FormGroup({
        'fileType': new FormControl(null, [Validators.required ,this.checkMusicFileType.bind(this) ]),
        'fileName': new FormControl(null, [Validators.required , this.checkMusicFilename.bind(this)]),
        'file': new FormControl(null , [Validators.required ])
      })
    });
  }

  checkMusicFileType(control: FormControl): {[s: string]: boolean} { 
    if(control.value){
      if(control.value !== 'mpeg'){
        return {'typeError': true};        
      }
    }
    
    return null;
  }

  
  checkMusicFilename(control: FormControl): {[s: string]: boolean} { 
    if(control.value){
      const fileName = control.value.split('__')[1];      
      
      for (let i = 0; i < this.data.musicsInAlbum.length; i++) {
        const musicName = this.data.musicsInAlbum[i].split('__')[1];
        if(fileName === musicName){
          return {'filenameError': true};          
        }
      }
    }
    return null;
  }
  



  exitAddMusicToAlbumDialog(){
    this.dialogRef.close()
  }

  handleMusicInput( files: FileList){
    const musicName = files.item(0).name.split(".")[0];
    const index = this.lastMusicIndex + 1;
    const fileName = index.toString() + '__' + musicName;
    const fileType = files.item(0).type.split("/")[1];
    this.addMusicToAlbumForm.get('newMusic').setValue({
      'fileType': fileType,
      'fileName': fileName + '.mp3',
      'file': files.item(0)
    });   
    
}

  onSubmit(){
    this.isLoading = true
    this.submitted = true;
    if(this.addMusicToAlbumForm.invalid){
      this.isLoading = false;
      return
    }
    const newMusic: FileData = this.addMusicToAlbumForm.get('newMusic').value
    const addNewMusicObs: Observable<string> = this.albunsService.uploadFile(newMusic, this.data.albumId.toString() );
    this.subscription = addNewMusicObs
    .subscribe(message => {
      this.isLoading = false;
      this.albunsService.getAlbuns();
      this.exitAddMusicToAlbumDialog()
    }, err => {
      this.isLoading = false;
      console.log(err);
      this.exitAddMusicToAlbumDialog()
    })
  }


  
  ngOnDestroy(){
    if(this.subscription){
      this.subscription.unsubscribe();
    }
    
  }
}

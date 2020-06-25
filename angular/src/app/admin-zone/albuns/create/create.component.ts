import { Component, OnInit, OnDestroy } from '@angular/core';
import {FormControl, FormGroup, Validators, FormArray, ValidatorFn  } from '@angular/forms';
import { FileData} from '../album-data.model';
import{AlbunsService} from '../albuns.service';
import { Observable, Subscription } from 'rxjs';




@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, OnDestroy {

  albumForm: FormGroup;
  submitted = false;
  isLoading = false;
  imageTypes: string[] = ['jpeg', 'png'];
  private maxAlbumIdSubscription: Subscription;
  private createNewAlbumSub: Subscription

  constructor(private albunsService: AlbunsService) { }

  // convenience getter for easy access to form fields
  get f() { 
    return this.albumForm.controls;
  }



  get musicsControls() {
    // console.log((this.albumForm.get('albumMusics') as FormArray).controls)
    return (this.albumForm.get('albumMusics') as FormArray).controls;
  }

  



  ngOnInit() {
    this.initForm();
  }


  onAddMusic() {
    (<FormArray>this.albumForm.get('albumMusics')).push(
      new FormGroup({
        'fileType': new FormControl(null , [Validators.required , this.checkMusicFileType.bind(this)]),
        'fileName': new FormControl(null , Validators.required),
        'file': new FormControl(null , Validators.required)

      }  )
    );
  }

  
  onDeleteMusic(index: number){
    (<FormArray>this.albumForm.get('albumMusics')).removeAt(index);

  }


  handleNewAlbumMusicInput( files: FileList, index:number){
    const musicName = files.item(0).name.split(".")[0];
    const fileName = index.toString() + '__' + musicName;
    const fileType = files.item(0).type.split("/")[1];
    let musicInput =  (<FormArray>this.albumForm.get('albumMusics')).at(index);
    musicInput.setValue({
      'fileType': fileType,
      'fileName': fileName + '.mp3',
      'file': files.item(0)
    });   
  }

  handleNewAlbumPictureInput(files: FileList){
    const fileType = files.item(0).type.split("/")[1];
    const fileName =   files.item(0).name;
    this.albumForm.get('albumPicture').setValue({
      'fileType': fileType,
      'fileName': fileName,
      'file': files.item(0)
    })
  }



  private initForm() {

    this.albumForm = new FormGroup({
      'albumName': new FormControl( null, Validators.required),
      'albumPicture': new FormGroup({
        'fileType': new FormControl(null, [Validators.required , this.checkImageFileType.bind(this)]),
        'fileName': new FormControl(null, Validators.required),
        'file': new FormControl(null , Validators.required)
      }),
      'albumDescription': new FormControl( null, Validators.required),
      'usersRole': new FormControl( 'active', Validators.required),
      'albumMusics': new FormArray([])
      
    });
    this.onAddMusic();
  }

 

 

  checkMusicFileType(control: FormControl): {[s: string]: boolean} { 
    const fileType = control.value;
    console.log(fileType);
    if(fileType !== 'mpeg'){
      return {'typeError': true};
       
    }
    return null;
  }

 

  checkImageFileType(control: FormControl): {[s: string]: boolean} { 
    const fileType = control.value;
    console.log(fileType);
    console.log( this.imageTypes.includes( fileType));
    console.log("na cehck image" , control.errors)
    if(  !this.imageTypes.includes( fileType) ){
       return {'typeError': true};
    }    
    return null;
  }


  onSubmit(){
    this.submitted = true;
    if(this.albumForm.invalid){
      return
    }

    const newAlbumName = this.albumForm.get('albumName').value
    const newAlbumPicture: FileData = this.albumForm.get('albumPicture').value
    const newAlbumDescription = this.albumForm.get('albumDescription').value
    const newAlbumUserRole = this.albumForm.get('usersRole').value
    const newAlbumMusics: FileData[] = this.albumForm.get('albumMusics').value;
    let maxAlbumId;

    this.isLoading = true;

    const maxIdObs: Observable<{message: string, maxAlbumId: number}> = this.albunsService.getMaxAlbumId();
    this.maxAlbumIdSubscription = maxIdObs.subscribe(response => {
      maxAlbumId  = response.maxAlbumId;
      this.albunsService.createNemAlbum(newAlbumName, maxAlbumId.toString(), newAlbumDescription , newAlbumUserRole , newAlbumMusics , newAlbumPicture)
      this.createNewAlbumSub = this.albunsService.getNewAlbumListener()
        .subscribe(res => {
          this.isLoading = false;
        })
    });
  }

  ngOnDestroy(){
    if(this.maxAlbumIdSubscription){
      this.maxAlbumIdSubscription.unsubscribe()
    }
    if(this.createNewAlbumSub){
    this.createNewAlbumSub.unsubscribe()
    }
  }
  

}

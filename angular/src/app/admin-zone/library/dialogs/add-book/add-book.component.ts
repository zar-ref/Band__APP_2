import { Component, OnInit, Inject, OnDestroy  } from '@angular/core';
import{MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { Subscription, Observable } from 'rxjs';
import{LibraryService} from '../../library.service'
import { FormGroup, FormControl, Validators } from '@angular/forms';



@Component({
  selector: 'add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss']
})
export class AddBookComponent implements OnInit, OnDestroy {

  public isLoading = false;
  newBookForm: FormGroup
  submitted = false;
  private subscription: Subscription
  httpTypes: string[] = ['https:', 'http:'];

  constructor(
    public dialogRef: MatDialogRef<AddBookComponent>,
    private libraryService: LibraryService, 
    
  ) { }

  ngOnInit() {
    this.newBookForm = new FormGroup({
      'newBookName': new FormControl(null, [Validators.required ]),
      'newBookAuthor': new FormControl(null, [Validators.required ]),
      'newBookDescription': new FormControl(null, [Validators.required ]),
      'newBookLink': new FormControl(null, [Validators.required, this.checkLinkIsValid.bind(this) ]),
  });
  }


  exitAddBook(){
    this.dialogRef.close()
  }

  onSubmit(){
    this.isLoading = true;
    this.submitted = true;
    if(this.newBookForm.invalid){
      this.isLoading = false;
      return;
    }
    const newBookName = this.newBookForm.get('newBookName').value;
    const newBookAuthor = this.newBookForm.get('newBookAuthor').value;
    const newBookDescription = this.newBookForm.get('newBookDescription').value;
    const newBookLink = this.newBookForm.get('newBookLink').value;
    this.libraryService.postBook(newBookName, newBookAuthor, newBookDescription , newBookLink)
    
    this.subscription = this.libraryService.getBookActionListener()
      .subscribe(message => {
        this.isLoading = false;
        this.libraryService.getBooks();
        this.exitAddBook();
      }, err => {
        this.isLoading = false;
        console.log(err);
        this.exitAddBook()
      })
  }

  checkLinkIsValid(control: FormControl): {[s: string]: boolean} { 
    const link= control.value;
    console.log(link);
    let splittedLink = '';
    try {
      splittedLink = link.split("//")[0]
    } catch (error) {
      if(error){
        return {'invalidLink': true};
      }
    }    
    console.log( this.httpTypes.includes( splittedLink));
    if(  !this.httpTypes.includes( splittedLink) ){
       return {'invalidLink': true};
    }    
    return null;
  }

  ngOnDestroy(){
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }


}

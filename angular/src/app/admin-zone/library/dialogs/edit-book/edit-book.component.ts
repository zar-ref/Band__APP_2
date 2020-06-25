import { Component, OnInit, Inject, OnDestroy  } from '@angular/core';
import{MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { Subscription, Observable } from 'rxjs';
import{LibraryService} from '../../library.service'
import { FormGroup, FormControl, Validators } from '@angular/forms';



@Component({
  selector: 'edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.scss']
})
export class EditBookComponent implements OnInit, OnDestroy {

  public isLoading = false;
  editBookForm: FormGroup
  submitted = false;
  private subscription: Subscription
  httpTypes: string[] = ['https:', 'http:'];

  constructor(
    public dialogRef: MatDialogRef<EditBookComponent>,
    private libraryService: LibraryService, 
    @Inject(MAT_DIALOG_DATA) public data:{bookId: string , name: string, author: string, description: string, link: string}
  ) { }

  ngOnInit() {
    this.editBookForm = new FormGroup({
      'bookName': new FormControl(this.data.name, [Validators.required ]),
      'bookAuthor': new FormControl(this.data.author, [Validators.required ]),
      'bookDescription': new FormControl(this.data.description, [Validators.required ]),
      'bookLink': new FormControl(this.data.link, [Validators.required, this.checkLinkIsValid.bind(this) ]),
  });
  }


  exitEditBook(){
    this.dialogRef.close()
  }

  onSubmit(){
    this.isLoading = true;
    this.submitted = true;
    if(this.editBookForm.invalid){
      this.isLoading = false;
      return;
    }
    const bookName = this.editBookForm.get('bookName').value;
    const bookAuthor = this.editBookForm.get('bookAuthor').value;
    const bookDescription = this.editBookForm.get('bookDescription').value;
    const bookLink = this.editBookForm.get('bookLink').value;
    this.libraryService.updateBook( this.data.bookId, bookName,bookAuthor, bookDescription , bookLink)
    
    this.subscription = this.libraryService.getBookActionListener()
      .subscribe(message => {
        this.isLoading = false;
        this.libraryService.getBooks();
        this.exitEditBook();
      }, err => {
        this.isLoading = false;
        console.log(err);
        this.exitEditBook()
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

import { Component, OnInit, Inject  } from '@angular/core';
import{MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { Subscription, Observable } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LibraryService } from '../../library.service';


@Component({
  selector: 'app-delete-book',
  templateUrl: './delete-book.component.html',
  styleUrls: ['./delete-book.component.scss']
})
export class DeleteBookComponent implements OnInit {

  public isLoading = false;
  private subscription: Subscription


  constructor(
    public dialogRef: MatDialogRef<DeleteBookComponent>,
    private libraryService: LibraryService, 
    @Inject(MAT_DIALOG_DATA) public  data: {bookId: string, bookName: string}
  ) { }

  ngOnInit() {
    console.log(this.data);
  }

  exitDeleteBook(){
    this.dialogRef.close()
  }

  deleteBook(){
    this.isLoading = true;
    this.libraryService.deleteBook(this.data.bookId);
    this.subscription = this.libraryService.getBookActionListener()
      .subscribe(message => {
        this.isLoading = false;
        this.libraryService.getBooks();
        this.exitDeleteBook()
      }, err => {
        this.isLoading = false;
        console.log(err);
        this.exitDeleteBook()
      })
  }

  ngOnDestroy(){
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

  

}

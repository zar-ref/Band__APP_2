import { Component, OnInit } from '@angular/core';
import { LibraryService } from './library.service';
import { BookData } from './book-data.model';
import { Subscription } from 'rxjs';
import {AddBookComponent} from './dialogs/add-book/add-book.component'
import { MatDialog } from '@angular/material';
import { EditBookComponent } from './dialogs/edit-book/edit-book.component';
import {DeleteBookComponent} from './dialogs/delete-book/delete-book.component'

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {

  books: BookData[] = []
  isLoading = false;
  private booksSub : Subscription;

  constructor(private libraryService: LibraryService,  private matDialog:MatDialog) { }

  ngOnInit() {
    this.isLoading = true;
    this.libraryService.getBooks()
    this.booksSub = this.libraryService.books.subscribe( books => {
      if(books){
        console.log(books);
        this.books = books
        this.isLoading = false
      }else {
        this.isLoading = false
      }
     
    }, err => {
      console.log(err);
    })
  }

  showAddBookDialog(){
    const dialogRef = this.matDialog.open( AddBookComponent, {
      width: '550px',
      height: '580px'
    });
  }

  showEditBookDialog(bookId: string , name: string , author: string , description: string , link: string ){
    const dialogRef = this.matDialog.open( EditBookComponent, {
      width: '550px',
      height: '580px',
      data: {bookId: bookId , name: name, author: author, description: description, link: link}
    });
  }

  showDeleteBookDialog(bookId: string , bookName: string ){
    const dialogRef = this.matDialog.open( DeleteBookComponent, {
      width: '550px',
      height: '580px',
      data: {bookId: bookId , bookName: bookName}
    });
  }

}

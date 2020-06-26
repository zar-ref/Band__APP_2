import { Component, OnInit } from '@angular/core';
import { LibraryService } from '../admin-zone/library/library.service';
import { BookData } from '../admin-zone/library/book-data.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {


  books: BookData[] = []
  isLoading = false;
  private booksSub : Subscription;

  constructor(private libraryService: LibraryService) { }

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

  ngOnDestroy(){
    if(this.booksSub){
      this.booksSub.unsubscribe()
    }
  }

}

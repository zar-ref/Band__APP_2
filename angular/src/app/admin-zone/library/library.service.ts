import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import {Subject, throwError, BehaviorSubject} from 'rxjs' //
import {map, catchError, tap } from 'rxjs/operators'
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { BookData } from './book-data.model';

@Injectable({providedIn: "root"})
export class LibraryService {

    books= new BehaviorSubject<BookData[]> (null);
    private bookAction = new Subject<string>();
    constructor(  private http: HttpClient, private router: Router){}


    getBooks(){
        this.http.get<{message: string, books: BookData[]}>(environment.webRestUrl + 'library/get-books')
            .pipe(
                catchError(this.handleError)  
            ).subscribe( booksData =>  {           
                this.books.next(booksData.books);
            })
    }

    getBookActionListener(){
        return this.bookAction.asObservable();
    }

    postBook(name : string, author : string, description : string , link : number){
        this.http.post<string>(environment.webRestUrl + 'library/post-book' , {name: name, author:author , description: description, link:link})
            .pipe(
                catchError(this.handleError)
            ).subscribe(response => {
                this.bookAction.next("Upload de Livro teve sucesso!")
            })
    }

    updateBook(bookId: string, name : string, author : string, description : string , link : number){
        this.http.put<string>(environment.webRestUrl + 'library/edit-book' , { bookId: bookId ,name: name, author:author , description: description, link:link})
            .pipe(
                catchError(this.handleError)
            ).subscribe(response => {
                this.bookAction.next("Update de Livro teve sucesso!")
            })
    }

    deleteBook(bookId : string ){
        const queryParams = `?bookToDelete=${bookId}`;
        return this.http.delete<string>(environment.webRestUrl + 'library/delete-book' + queryParams)
            .pipe(catchError(this.handleError))
            .subscribe(response => {
                this.bookAction.next("Apagar Livro teve sucesso!")
            })
    }

    
    handleError(errorRes: HttpErrorResponse){
        console.log(errorRes)
        let errorMessage = errorRes.error.message;
        return throwError(errorMessage);

    }

}
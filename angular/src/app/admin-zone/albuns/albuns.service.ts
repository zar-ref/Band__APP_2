import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import {Subject, throwError, BehaviorSubject} from 'rxjs' //
import {map, catchError, tap } from 'rxjs/operators'
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import {AlbumData, FileData} from './album-data.model'


@Injectable({providedIn: "root"})
export class AlbunsService {

    private newAlbum = new Subject<string>();
    albuns= new BehaviorSubject<AlbumData[]> (null);
    constructor(  private http: HttpClient, private router: Router){}


    getMaxAlbumId(){
       return this.http.get<{message: string ,  maxAlbumId: number}>(environment.webRestUrl + 'admin-zone/albuns/get-max-album-id')
        .pipe(
            catchError(this.handleError)
        )
    }

    getNewAlbumListener(){
        return this.newAlbum.asObservable();
    }

    createNemAlbum(
        newAlbumName: string, 
        newAlbumDir:string, 
        newAlbumDescription: string, 
        userRole:string , 
        musicsToUpload:FileData[], 
        newAlbumPicture: FileData 
        ){
        console.log(arguments)
        
        this.http.post<string>(environment.webRestUrl + 'admin-zone/albuns/create-album' , {newAlbumName : newAlbumName, newAlbumDescription:  newAlbumDescription, newAlbumUserRole: userRole, newAlbumDir: newAlbumDir})
            .pipe(
                catchError( this.handleError)
            ).subscribe(res => {
                if(res){
                    let HTTPArray: any [] = [];
                    const imgFormData = new FormData();
                    imgFormData.append('file', newAlbumPicture.file, newAlbumPicture.fileName )
                    imgFormData.append('dir', newAlbumDir); 
                    let uploadPicture = this.http.post<string>(environment.webRestUrl + 'admin-zone/albuns/upload-file' , imgFormData);
                    HTTPArray.push( uploadPicture);
              
                    musicsToUpload.forEach(music => {
                        const musicFormData = new FormData();
                        musicFormData.append('file', music.file, music.fileName )
                        musicFormData.append('dir', newAlbumDir); 
                        let uploadMusic = this.http.post<string>(environment.webRestUrl + 'admin-zone/albuns/upload-file' , musicFormData)
                        HTTPArray.push(uploadMusic);
                    
                    });
                    
                    forkJoin(HTTPArray)
                        .pipe(
                            catchError(this.handleError)   
                        )
                        .subscribe(results => {
                        this.newAlbum.next('Upload de Album Completo!');
                        this.router.navigate(['/admin-zone' , 'albuns', 'edit']);
                    });

                }
            }, err => {
                this.newAlbum.next(err);
            })
        
   
    }


    getAlbuns(){
        this.http.get<{albuns: AlbumData[]}>(environment.webRestUrl + 'admin-zone/albuns/get-albuns')
            .pipe(
                catchError(this.handleError)                    
            ).subscribe((albunsData )  => {
                console.log(albunsData.albuns.length);
                this.albuns.next(albunsData.albuns);
            })
    }

    downloadMusic(albumId: string, musicToDownload: string){
        const path = albumId+ '/' + musicToDownload;
        console.log(path);
        const dir = albumId
        const music = musicToDownload;
        const queryParams = `?dir=${dir}&music=${music}`;
        return this.http.get(environment.webRestUrl + 'admin-zone/albuns/download-file' + queryParams, {
            responseType: 'blob',
            headers:new HttpHeaders().append('Content-Type','application/json')
        });
    }



    uploadFile(file: FileData , albumId: string){
        const fileFormData = new FormData();
        fileFormData.append('file', file.file, file.fileName )
        fileFormData.append('dir', albumId); 
        return this.http.post<string>(environment.webRestUrl + 'admin-zone/albuns/upload-file' , fileFormData)
               .pipe(catchError(this.handleError))         
    }

    deleteFile(albumId: string, fileToDelete: string){
        const queryParams = `?albumId=${albumId}&fileToDelete=${fileToDelete}`;
        return this.http.delete<string>(environment.webRestUrl + 'admin-zone/albuns/delete-file' + queryParams)
            .pipe(catchError(this.handleError))
    }   

    updateAlbumName(albumId: string, newAlbumName: string){
        return this.http.put<string>(environment.webRestUrl + 'admin-zone/albuns/update-album-name' , {albumId: albumId, newAlbumName: newAlbumName})
            .pipe(catchError(this.handleError))
    }

    updateAlbumDescription(albumId: string,  newAlbumDescription: string){
        return this.http.put<string>(environment.webRestUrl + 'admin-zone/albuns/update-album-description' , {albumId: albumId, newAlbumDescription: newAlbumDescription})
            .pipe(catchError(this.handleError))
    }

    deleteAlbum(albumId: string){
        const queryParams = `?albumId=${albumId}`
        return this.http.delete<string>(environment.webRestUrl + 'admin-zone/albuns/delete-album' + queryParams)
            .pipe(catchError(this.handleError))
    }


    handleError(errorRes: HttpErrorResponse){
        console.log(errorRes)
        let errorMessage = errorRes.error.message;
        return throwError(errorMessage);

    }
}
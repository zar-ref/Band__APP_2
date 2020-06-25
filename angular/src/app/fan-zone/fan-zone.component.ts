import { Component, OnInit, OnDestroy } from '@angular/core';
import { saveAs} from 'file-saver';
import { Subscription } from 'rxjs';
import { FanZoneService } from './fan-zone.service';
import { AlbumData } from './album-data.model';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { AlbunsService } from '../admin-zone/albuns/albuns.service';

@Component({
  selector: 'app-fan-zone',
  templateUrl: './fan-zone.component.html',
  styleUrls: ['./fan-zone.component.scss']
})
export class FanZoneComponent implements OnInit, OnDestroy {

  albuns: AlbumData[] = []
  isLoading = false;
  private albunsSub: Subscription;
  constructor(private fanZoneService: FanZoneService , private albunsService: AlbunsService, private sanitizer: DomSanitizer ) { }

  ngOnInit() {
    this.isLoading = true;
    this.fanZoneService.getAlbuns()
    this.albunsSub = this.fanZoneService.albuns
      .subscribe(albuns => {
        if(albuns){
          this.albuns = albuns
          this.isLoading = false
        }      
        else {
          this.isLoading = false
        }
      })
  }


  getAccess(albumId: string){
    this.fanZoneService.getAccessToAlbum(albumId);
    this.ngOnInit();
  }


  getSantizeUrl(url : string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  getLinks(albumId:number , file: string, albumPath: string){
    const link = environment.webUrl + 'albunsfiles/' + albumId.toString() + "/" + file;
    return this.getSantizeUrl(link);
  }

  //////Utilização do serviço de Albuns - AlbunsService

  getDownloadLink(albumId: number, file: string){    


    this.albunsService.downloadMusic(albumId.toString(), file)
      .subscribe(data => {
        const filename = file.split('__')[1];
        saveAs(data, filename);
      },
      err =>{
        console.log(err);
      });
  }


  ngOnDestroy(){
    if(this.albunsSub){
      this.albunsSub.unsubscribe()
    }
  }

}

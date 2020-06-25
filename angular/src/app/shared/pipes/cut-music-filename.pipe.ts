
import {  Pipe, PipeTransform  } from '@angular/core';

@Pipe({name: 'cutMusicFilename'})
export class cutMusicFilename implements PipeTransform{
  transform(expression: string): string {
      if(expression) {
           const filename = expression.split('.')[0];
           return filename.split('__')[1];
      }
      return;
   
  }
}
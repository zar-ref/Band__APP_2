import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import {
  MatInputModule, 
  MatCardModule, 
  MatButtonModule, 
  MatToolbarModule, 
  MatExpansionModule, 
  MatProgressSpinnerModule, 
  MatPaginatorModule, 
  MatTableModule, 
  MatTooltipModule, 
  MatDialogModule,   
  MatRadioModule, 
  MatSelectModule,
  MatSidenavModule
} from '@angular/material';


@NgModule({
  declarations: [

  ],
  imports: [CommonModule],
  exports: [
    // BrowserAnimationsModule,
    CommonModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatTableModule,
    MatTooltipModule,
    MatDialogModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule
  ],
  entryComponents: []
})
export class MaterialModule {}

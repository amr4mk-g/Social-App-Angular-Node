import { NgModule } from "@angular/core";

import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDialogModule} from '@angular/material/dialog';

@NgModule({
    exports: [MatFormFieldModule, MatInputModule, MatCardModule, 
        MatProgressSpinnerModule, MatButtonModule, MatToolbarModule, 
        MatExpansionModule, MatPaginatorModule, MatDialogModule]   
})
export class MaterialModule {
     
}
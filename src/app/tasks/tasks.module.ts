import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TasksRoutingModule } from './tasks-routing.module';
import { TaskListComponent } from './task-list/task-list.component';
import {TaskDetailsComponent} from "./task-details/task-details.component";
import {MatCardModule} from "@angular/material/card";
import {MatToolbarModule} from "@angular/material/toolbar";
import {FlexModule} from "@angular/flex-layout";
import {ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import { TaskAddComponent } from './task-add/task-add.component';
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatIconModule} from "@angular/material/icon";
import {MatChipsModule} from "@angular/material/chips";


@NgModule({
  declarations: [
    TaskListComponent,
    TaskDetailsComponent,
    TaskAddComponent
  ],
    imports: [
        CommonModule,
        TasksRoutingModule,
        MatCardModule,
        MatToolbarModule,
        FlexModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatInputModule,
        MatProgressBarModule,
        MatTableModule,
        MatPaginatorModule,
        MatIconModule,
        MatChipsModule,
    ],exports:[
    TaskListComponent,
    TaskDetailsComponent
  ]
})
export class TasksModule { }

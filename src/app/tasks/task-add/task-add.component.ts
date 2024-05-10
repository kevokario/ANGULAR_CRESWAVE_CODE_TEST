import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {finalize, Subject, takeUntil} from "rxjs";
import {TaskService} from "../../services/task.service";
import {Task} from "../../models/Task";
import {Router} from "@angular/router";
import {UtilService} from "../../services/util.service";

@Component({
  selector: 'app-task-add',
  templateUrl: './task-add.component.html',
  styleUrls: ['./task-add.component.scss']
})
export class TaskAddComponent implements OnInit,OnDestroy{
  taskForm!:FormGroup;
  formSubmitted:boolean = false;
  addingTask:boolean = false;
  destroy$:Subject<boolean> = new Subject<boolean>();

  constructor(private formBuilder: FormBuilder,
              private taskService:TaskService,
              private utilService: UtilService,
              private router:Router
  ) {
  }

  ngOnDestroy():void{
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit():void{
    this.initForm();
  }

  initForm():void{
    this.taskForm = this.formBuilder.group({
      title: [null, Validators.required],
      description: [null, Validators.required],
    })
  }

  get control(){
    return this.taskForm.controls;
  }

  addTask(){
    this.formSubmitted = true;
    console.log(this.taskForm.value);
    if(this.taskForm.invalid) return;

    let task :Task = {
      title: this.taskForm.value.title,
      description: this.taskForm.value.description,
      completed: false
    };


    this.addingTask = true;
    this.taskService.addTask(task).pipe(
      takeUntil(this.destroy$),
      finalize(()=>{this.addingTask = false}))
      .subscribe({
          next:(response)=>{
            this.utilService.success('Task Created Successfully!!');
            this.formSubmitted = false;
            this.addingTask = false;
            // this.initForm();

          },
          error:(error)=>{
            this.utilService.error('Task Could not be created');
          }
        }
      );
  }

  viewTasks(){
    this.router.navigate(['tasks']);
  }
}

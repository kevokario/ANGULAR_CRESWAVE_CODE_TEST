import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UtilService} from "../../services/util.service";
import {TaskService} from "../../services/task.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Task} from "../../models/Task";
import {finalize, Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent implements OnInit,OnDestroy{

  taskForm!:FormGroup;
  formSubmitted:boolean = false;
  updatingTask:boolean = false;
  destroy$:Subject<boolean> = new Subject<boolean>();
  pathParam!:number;

  constructor(private formBuilder: FormBuilder,
              private utilService:UtilService,
              private taskService: TaskService,
              private  router:Router,
              private activeRoute:ActivatedRoute,) {

  }

  ngOnDestroy():void{
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit() {
    this.getTask();
    this.initForm();
  }

  getTask(){
    this.activeRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe({
      next:(params)=>{
        this.pathParam = params['id'];
        this.fetchTaskToUpdate();
      },
      error:()=>{
        this.viewTasks();
      }
    })
  }

  fetchTaskToUpdate(){
    this.taskService
      .getTask(String(this.pathParam))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
      next:(task:Task)=>{
        if(task){
          this.updateForm(task);
        }
      },error:()=>{
        this.utilService.error("There was a problem fetching task");
        this.viewTasks();
        }
    })
  }

  updateForm(task:Task){
    this.taskForm.patchValue({
      title:task.title,
      description:task.description,
    })
  }

  initForm(){
    this.taskForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    })
  }

  viewTasks(){
    this.router.navigate(['/tasks'])
  }

  updateTask(){
    this.formSubmitted = true;
    if(this.taskForm.invalid) return;

    this.updatingTask = true;
    this.taskService
      .updateTask(String(this.pathParam), this.taskForm.value)
      .pipe(
        takeUntil(this.destroy$),
        finalize(()=>{this.updatingTask = false})
      )
      .subscribe({
        next:(response)=>{
          this.utilService.success('Task Updated Successfully!!');
          this.viewTasks();
        },
        error:(error)=>{
          this.utilService.error('There was a problem updating task');
        }
      });
  }

  get control() {
    return this.taskForm.controls;
  }

}

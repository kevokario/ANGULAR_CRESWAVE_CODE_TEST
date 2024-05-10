import {Component, OnInit, OnDestroy, ViewChild, AfterViewInit} from '@angular/core';
import {TaskService} from "../../services/task.service";
import {Task} from "../../models/Task";
import {finalize, Subject, takeUntil} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import Swal from "sweetalert2";
import {Router} from "@angular/router";
import {UtilService} from "../../services/util.service";


@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements AfterViewInit,OnInit,OnDestroy{

  showTaskList = false;
  loadingTasks = false;


  tasks:Array<Task> = new Array<Task>();
  taskTableColumns:Array<string> = ["no","title","description","status","action"];
  dataSource = new MatTableDataSource<Task>(this.tasks);
  destroy$:Subject<boolean> = new Subject<boolean>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(private tasksService:TaskService,
              private utilService:UtilService,
              private router:Router) {
  }

  ngOnDestroy():void{
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit():void{
    this.getTasks();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getTasks(){
    this.loadingTasks = true;
    this.tasksService
      .getTasks()
      .pipe(takeUntil(this.destroy$),finalize(() => this.loadingTasks = false))
      .subscribe({
        next:(tasks)=>{
          this.setTaskData(tasks);
        },
        error:()=>{
          this.utilService.error("There was an error while fetching tasks.");
        }
      });
  }

  setTaskData(tasks:Array<Task>){
    this.tasks = tasks;
    this.dataSource.data = tasks;
    this.dataSource.paginator = this.paginator;
  }

  addNewTask(){
    this.router.navigate(['/tasks/add']);
  }

  editTask( task:Task){
    this.router.navigate(['/tasks',task.id]);
  }

  async deleteTask(index:number, task:Task) {


    let option = await Swal.fire({
      title:`Delete Task`,
      icon:"question",
      html:`You are about to delete task '<b>${task.title}</b>'.<br> Proceed with action ?`,
      showCancelButton:true,
      cancelButtonText:'Cancel',
      confirmButtonText:'Proceed',
      reverseButtons:true
    })

    if(option.isDismissed) return;

    this.tasksService.deleteTask(String(task.id)).pipe(
      takeUntil(this.destroy$),
    ).subscribe({
        next:()=>{
          this.utilService.success("Task Deleted Successfully!!");
          this.tasks.splice(index,1);
          this.tasks = [...this.tasks];
          this.setTaskData(this.tasks);
        },
        error:()=>{
          this.utilService.error("Could not delete this task!!")
        }
      }
    );
  }

  setStatus(task:Task,index:number){
    task.completed = !task.completed;
    this.tasks[index] = task;
    //update data
    //set this
    this.tasksService.updateTask(String(task.id),task).subscribe(
      {
        next:()=>{
          this.setTaskData(this.tasks);
          this.utilService.success(`Task ${task.title}'s status updated successfully`);
        },
        error:()=>{
          this.utilService.error("Could not update status for this task")
        },
      }

    )
    this.setTaskData(this.tasks);
  }



}

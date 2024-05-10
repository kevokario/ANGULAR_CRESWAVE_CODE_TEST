import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Task} from "../models/Task";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  addTask(newTask: Task):Observable<any> {
    return this.http.post<Task>(`${environment.apiUrl}/tasks`, newTask);
  }

  getTasks():Observable<Task[]> {
    return this.http.get<Task[]>(`${environment.apiUrl}/tasks`);
  }

  deleteTask(id:string):Observable<Task> {
    return this.http.delete<Task>(`${environment.apiUrl}/tasks/${id}`);
  }

  getTask(id:string):Observable<Task> {
    return this.http.get<Task>(`${environment.apiUrl}/tasks/${id}`);
  }

  updateTask(id:string,task:Task):Observable<any> {
    return this.http.put<Task>(`${environment.apiUrl}/tasks/${id}`, task);
  }

}

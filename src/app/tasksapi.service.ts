import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

const baseUrl = 'https://localhost:7149/api/tasks'

export interface Task {
  id: number,
  taskNumber: number;
  title: string;
  description: string;
  dueDate: Date;
  status: number;
}

@Injectable({
  providedIn: 'root'
})
export class TasksapiService {

  constructor(private http: HttpClient) { }

  getTasksList() {
    return this.http.get(baseUrl);
  }

  getTask(id: number): Observable<any> {
    return this.http.get(baseUrl + "/" + id)
    .pipe(
      catchError(this.handleError('addSmartphone', id))
    );
  }

  addTask(task: Task): Observable<any> {
    return this.http.post<Task>(baseUrl, task)
      .pipe(
        catchError(this.handleError('addTask', task))
      );
  }

  updateTask(task: Task): Observable<any> {
    return this.http.put<Task>(baseUrl + "/" + task.id, task)
      .pipe(
        catchError(this.handleError('addTask', task))
      );
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(baseUrl + "/" + id)
    .pipe(
      catchError(this.handleError('addSmartphone', id))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(message);
  }
}

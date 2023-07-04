import { Component, ElementRef, ViewChild } from '@angular/core';
import { TasksapiService, Task } from './tasksapi.service'

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Tasks Manager App Carlos';
  tasksList: any;
  selectedTask!: Task;
  closeResult: string | undefined;

  @ViewChild('mymodal') mymodal?: ElementRef;
  @ViewChild('detmodal') detmodal?: ElementRef;
  @ViewChild('delmodal') delmodal?: ElementRef;
  @ViewChild('updmodal') updmodal?: ElementRef;

  createForm = new FormGroup({
    taskNumber: new FormControl(''),
    title: new FormControl(''),
    description: new FormControl(''),
    dueDate: new FormControl(''),
    status: new FormControl(''),
  });

  taskNumber: number = 0;
  taskTitle: string = '';
  description: string = '';
  dueDate = new Date();
  status: number = 0;

  statusArray: string[] = ["New", "In Progress", "Completed"]

  constructor(
    public apitasks: TasksapiService,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void{
    this.getTasksList();
  }

  getTasksList(): void {
    this.apitasks.getTasksList().subscribe({
      next: (apitasks) => {
        this.tasksList = apitasks;
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => console.info('complete')
    });
  }

  getTask(id: number): void {
    this.apitasks.getTask(id).subscribe({
      next: (task) => {
        this.selectedTask = task;
        this.open(this.detmodal);
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => console.info('complete')
    });
  }

  createTask(): void {
    let data = {
      id: 0,
      taskNumber: this.taskNumber,
      title: this.taskTitle,
      description: this.description,
      dueDate: this.dueDate,
      status: this.status,
    }
    this.apitasks.addTask(data).subscribe({
      next: () => {
        this.getTasksList();
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        this.modalService.dismissAll();
      }
    })
  }

  getUpdateTask(id: number) {
    this.selectedTask = this.tasksList.filter((s: { id: number; }) => s.id == id)[0];
    this.taskNumber = this.selectedTask?.taskNumber;
    this.taskTitle = this.selectedTask?.title;
    this.description = this.selectedTask?.description;
    this.dueDate = this.selectedTask?.dueDate;
    this.status = this.selectedTask.status
    this.open(this.updmodal);
  }

  postUpdateTask(): void {
    let data = {
      id: this.selectedTask?.id,
      taskNumber: this.taskNumber,
      title: this.taskTitle,
      description: this.description,
      dueDate: this.dueDate,
      status: this.status,
    }
    this.apitasks.updateTask(data).subscribe({
      next: () => {
        this.getTasksList();
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        this.modalService.dismissAll();
      }
    })
  }

  getDeleteTask(id: number): void {
    this.selectedTask = this.tasksList.filter((s: { id: number; }) => s.id == id)[0];
    this.open(this.delmodal);
  }

  postDeleteTask(id: number): void {
    this.apitasks.deleteTask(id).subscribe({
      next: () => {
        this.getTasksList();
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        this.modalService.dismissAll();
      }
    })
  }

  open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
}

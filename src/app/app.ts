import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [CommonModule,FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
  protected readonly title = signal('todolist');
  tasks:any;
  isLoading:boolean=true;
  taskname:string="";
  isAdding:boolean=false;
  isDeleting:{[key:number]:boolean}={};
  isToggling:{[key:number]:boolean}={};
  api_url='https://todo-backend-y56l.onrender.com'
  constructor(private http:HttpClient){}
ngOnInit() {
  this.http.get(`${this.api_url}/tasks`).subscribe({
    next:(res:any)=>{
      this.tasks=res.data;
      this.isLoading=false
      console.log(this.tasks)
    }
  })
}
addTask(){
  if(!this.taskname.trim()) return;
  this.isAdding=true;
  let body={
    tname:this.taskname.trim(),
    tstatus:'pending'
  }
  this.http.post(`${this.api_url}/addtask`,body).subscribe({
    next:(res:any)=>{
      console.log("ok")
      this.tasks.push(res.data);
      this.taskname = "";
      this.isAdding=false;
    },
    error:()=>{
      this.isAdding=false;
    }
  })
}

deleteTask(id:any){
  this.isDeleting[id]=true;
  this.http.delete(`${this.api_url}/deletetask/${id}`).subscribe({
    next:(res)=>{
      console.log("ok")
      this.tasks = this.tasks.filter((task: any) => task.id !== id);
      delete this.isDeleting[id];
    },
    error:()=>{
      delete this.isDeleting[id];
    }
  })
}

toggleTask(task: any) {
  this.isToggling[task.id]=true;
  const newStatus = task.tstatus === 'pending' ? 'completed' : 'pending';
  this.http.put(`${this.api_url}/updatetask/${task.id}`, { tname: task.tname, tstatus: newStatus }).subscribe({
    next: (res: any) => {
      task.tstatus = newStatus;
      this.isToggling[task.id]=false;
    },
    error:()=>{
      this.isToggling[task.id]=false;
    }
  });
}


}

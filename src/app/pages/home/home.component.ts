import {Component, computed, effect, inject, Injector, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  tasks = signal<Task[]>([]);

  ngOnInit() {
    const tasks: Task[] = JSON.parse(localStorage.getItem('tasks') || '[]');
    this.tasks.set(tasks);
    this.trackTasks();
  }

  injector = inject(Injector)

  trackTasks() {
    effect(() => {
      const tasks: Task[] = this.tasks();
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }, { injector: this.injector });
  }

  filter = signal<'all' | 'pending' | 'completed'>('all');

  taskByFilter = computed(() => {
    const filter: string = this.filter();
    const tasks: Task[] = this.tasks();
    if (filter === 'pending') {
      return tasks.filter((task: Task) => !task.completed);
    }
    if (filter === 'completed') {
      return tasks.filter((task: Task) => task.completed);
    }
    return tasks;
  })

  newTaskCtrl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.pattern('^\\S.*$'),
      Validators.minLength(3),
    ]
  });


  changeHandler() {
    if(this.newTaskCtrl.valid) {
      this.addTask(this.newTaskCtrl.value.trim());
      this.newTaskCtrl.setValue('');
    }
  }

  addTask(title: string) {
    const newTask = {
      id: Date.now(),
      title: title,
      completed: false,
    }
    this.tasks.update((tasks) => [...tasks, newTask]);
  }

  updateTask(task: Task) {
    task.completed = !task.completed;
  }

  deleteTask(index: number) {
    this.tasks.update((tasks) => tasks.filter((task, position) => index !== position));
  }

  updateTaskEditingMode(editedTask: Task) {

    if (! editedTask.completed) {
      this.tasks.update((tasks: Task[]) => tasks.map((task: Task) => {
        task.editing = task.id !== editedTask.id;
        return task;
      }));

      editedTask.editing = true;
    }
  }

  updateTaskTitle(editedTask: Task, newTitle: string) {
    editedTask.title = newTitle;
    editedTask.editing = false;
  }

  changeFilter(filter: 'all' | 'pending' | 'completed') {
    this.filter.set(filter);
  }

  clearCompletedTasks() {
    this.tasks.update((tasks: Task[]) => tasks.filter((task: Task) => !task.completed));
  }
}

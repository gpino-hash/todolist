import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.css'
})
export class LabsComponent {
  welcome = 'todo-list';
  tasks = signal([
    'Instalar el Angular CLI',
    'Crear proyecto',
    'Crear Componentes',
  ]);
  name = signal('Gustavo');
  age = 40;
  disabled = true;
  img = 'https://www.w3schools.com/howto/img_avatar.png';

  person = signal({
    name: 'gustavo',
    age: 5,
    avatar: 'https://www.w3schools.com/howto/img_avatar.png'
  });

  colorCtrl = new FormControl();
  widthCtrl = new FormControl(50, {
    nonNullable: true,
  });
  nameCrtl = new FormControl('Gustavo', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(3),
    ]
  });

  constructor() {
    this.colorCtrl.valueChanges.subscribe(val => console.log(`Color changed to ${val}`));
  }

  clickHandler() {
    alert('clicked');
  }

  changeHandler(event: Event) {
    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    this.name.set(newValue);
  }

  changeAge(event: Event) {
    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    this.person.update(prevState => {
      return { ...prevState, age: parseInt(newValue, 10) };
    });
  }

  changeName(event: Event) {
    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    this.person.update(prevState => {
      return { ...prevState, name: newValue };
    });
  }

  keyDownHandler(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    console.log(input.value);
  }
}

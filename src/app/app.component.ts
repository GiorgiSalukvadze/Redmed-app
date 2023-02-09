import { Component } from '@angular/core';
import { User } from './shared/models/user.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  userForEdit!: User;
  editMode = false;
  addMode = false;

  onCloseModal() {
    this.addMode = false;
    this.editMode = false;
  }
  gotUser(user: User) {
    console.log(user);
    this.editMode = true;
    this.userForEdit = user;
  }
}

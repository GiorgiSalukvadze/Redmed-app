import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { User } from '../shared/models/user.interface';
import { Observable, startWith, switchMap } from 'rxjs';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  @Output() userForEdit = new EventEmitter<User>();
  users$!: Observable<User[]>;
  constructor(private userService: UserService) {}
  ngOnInit(): void {
    this.users$ = this.userService.userUpdated$.pipe(
      startWith(null),
      switchMap((res: any) => this.userService.getUsers())
    );
  }

  onEditClick(user: User) {
    this.userForEdit.emit(user);
  }
  onDeleteClick(user: User) {
    this.userService.removeUser(user).subscribe((res) => {});
  }
}

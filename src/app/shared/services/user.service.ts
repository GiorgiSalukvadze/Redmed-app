import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { merge, Observable, Subject, tap } from 'rxjs';
import { User } from '../models/user.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl: string = environment.baseUrl;
  userEditted$ = new Subject<User>();
  userRemoved$ = new Subject<number>();
  userAdded$ = new Subject<User>();
  userUpdated$ = merge(this.userEditted$, this.userRemoved$, this.userAdded$);

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}`);
  }
  addUser(user: User) {
    return this.http.post(`${this.baseUrl}`, user).pipe(
      tap(() => {
        this.userAdded$.next(user);
      })
    );
  }
  removeUser(user: User) {
    return this.http.delete(`${this.baseUrl}/${user.id}`).pipe(
      tap(() => {
        this.userRemoved$.next(user.id!);
      })
    );
  }
  updateUser(id: number, user: User) {
    return this.http.put(`${this.baseUrl}/${id}`, user).pipe(
      tap(() => {
        this.userEditted$.next(user);
      })
    );
  }
}

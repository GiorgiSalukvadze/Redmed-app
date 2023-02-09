import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors,
} from '@angular/forms';
import { map, Observable } from 'rxjs';
import { UserService } from './services/user.service';

@Injectable({ providedIn: 'root' })
export class PersonalNumberValidatorAsync implements AsyncValidator {
  constructor(private apiService: UserService) {}
  validate(
    control: AbstractControl<any, any>
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.apiService
      .getUsers()
      .pipe(
        map((users) =>
          users.find((user) => user.personalNumber === control.value)
            ? { personalNumber: true }
            : null
        )
      );
  }
  //   registerOnValidatorChange?(fn: () => void): void {
  //     throw new Error('Method not implemented.');
  //   }
}

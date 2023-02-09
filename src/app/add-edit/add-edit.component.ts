import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../shared/models/user.interface';
import { PersonalNumberValidatorAsync } from '../shared/personal-number.validator';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss'],
})
export class AddEditComponent implements OnInit {
  @Input() userForEdit!: User;
  @Output()
  closeModal = new EventEmitter<boolean>();
  formGroup!: FormGroup;
  cities = ['თბილისი', 'ბათუმი', 'ზუგდიდი', 'ფოთი'];
  ageHint = false;

  constructor(
    private userService: UserService,
    private personalNumberValidator: PersonalNumberValidatorAsync
  ) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      name: new FormControl('', Validators.required),
      surname: new FormControl('', Validators.required),
      personalNumber: new FormControl('', {
        validators: [Validators.required, Validators.pattern(/^\d{11}$/)],
        asyncValidators: !this.userForEdit
          ? [
              this.personalNumberValidator.validate.bind(
                this.personalNumberValidator
              ),
            ]
          : [],
      }),
      date: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
    });
    if (this.userForEdit) {
      this.updateFormgroupValue(this.userForEdit);
    }
  }

  updateFormgroupValue(user: User) {
    this.formGroup.setValue({
      name: user.name,
      surname: user.surname,
      personalNumber: user.personalNumber,
      date: user.date,
      gender: user.gender,
      city: user.city,
      address: user.address,
    });
  }

  onCancelClick() {
    this.closeModal.emit(true);
    this.formGroup.reset();
  }

  validYear() {
    return (
      new Date().getFullYear() -
        this.formGroup.get?.('date')?.value.split('-')[0] >=
      18
    );
  }

  onSubmitClick() {
    if (this.formGroup.valid) {
      if (this.validYear()) {
        if (this.userForEdit) {
          this.userService
            .updateUser(this.userForEdit.id!, this.formGroup.value)
            .subscribe((res) => {});
          this.onCancelClick();
        } else {
          this.userService.addUser(this.formGroup.value).subscribe((res) => {});
          this.onCancelClick();
        }
        this.formGroup.reset();
      } else {
        this.ageHint = true;
      }
    } else {
      this.formGroup.markAllAsTouched();
    }
  }
}

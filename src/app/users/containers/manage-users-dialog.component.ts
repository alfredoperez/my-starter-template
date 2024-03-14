import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  injectMutation,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';

import { User, UsersApiService } from '@my/users/data';

@Component({
  selector: 'manage-users-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    KeyFilterModule,
    InputNumberModule,
  ],
  template: `
    <div [formGroup]="usersFormGroup">
      <div class="flex flex-row justify-between items-center">
        <div class="flex flex-column gap-2 w-full">
          <label class="" for="name">Name</label>
          <input formControlName="name" pInputText />
        </div>
        <div class="flex flex-column gap-2 w-full">
          <label class="" for="age">Age</label>
          <p-inputNumber formControlName="age" />
        </div>
      </div>
      <div class="mt-4 flex justify-content-end gap-2">
        <button
          type="button"
          class="p-button-outlined p-button-secondary"
          label="Cancel"
          pButton
        ></button>
        <button
          type="button"
          class=""
          [disabled]="!usersFormGroup.valid"
          (click)="onSaveUser()"
          label="Save"
          pButton
        ></button>
      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageUsersDialogComponent {
  #queryClient = injectQueryClient();
  #dialogService = inject(DialogService);
  enabled?: boolean;
  usersFormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    age: new FormControl('', [Validators.required]),
  });

  usersApiService = inject(UsersApiService);

  userMutation = injectMutation(() => ({
    mutationKey: ['createUser'],
    onSuccess: () => {
      this.#queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    mutationFn: (user: User) => this.usersApiService.create(user),
  }));

  public onSaveUser() {
    if (this.usersFormGroup === undefined || this.usersFormGroup.invalid) {
      return;
    }

    const { name, age } = this.usersFormGroup.value;
    if (!name || !age) return;

    const user = {
      name,
      age,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as unknown as User;
    this.userMutation.mutate(user);

    this.#dialogService.dialogComponentRefMap.forEach((dialog) =>
      dialog.destroy(),
    );
  }
}

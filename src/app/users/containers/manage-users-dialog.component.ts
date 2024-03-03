import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { KeyFilterModule } from 'primeng/keyfilter';
import { InputNumberModule } from 'primeng/inputnumber';

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
            <label class="" for="key">Name</label>
            <input
                formControlName="key"
                pInputText
                pKeyFilter="alpha"
            />
          </div>
          <div class="flex flex-column gap-2 w-full">
            <label class="" for="key">Age</label>
            <p-inputNumber
                formControlName="age"
            />
          </div>
        </div>
        <div class="mt-4 flex justify-content-end gap-2">
          <button
              class="p-button-outlined p-button-secondary"
              label="Cancel"
              pButton
              type="button"
          ></button>
          <button
              [disabled]="!usersFormGroup.valid"
              class=""
              label="Save"
              pButton
              type="button"
          ></button>

        </div>
      </div>
    `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageUsersDialogComponent {
  usersFormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    age: new FormControl('', [Validators.required]),
  });
}

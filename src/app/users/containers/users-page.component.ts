import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, RowClickedEvent } from 'ag-grid-community';
import { ButtonModule } from 'primeng/button';
import {
  DialogService,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { PaginatorModule } from 'primeng/paginator';
import { PaginatorState } from 'primeng/paginator/paginator.interface';
import { RippleModule } from 'primeng/ripple';
import { RequestOptions } from '@my/shared/data';
import { User, usersQuery } from '@my/users/data';
import { ManageUsersDialogComponent } from './manage-users-dialog.component';

@Component({
  selector: 'users-page',
  standalone: true,
  imports: [
    CommonModule,
    AgGridModule,
    ButtonModule,
    PaginatorModule,
    RippleModule,
    DynamicDialogModule,
  ],
  providers: [DialogService],
  template: `
    <div
      class="flex flex-column flex-grow h-full fadein animation-duration-1000 gap-4"
    >
      <div class="flex justify-content-between">
        <h1 class="text-2xl font-semibold">Users</h1>
        <button
          class="p-button-secondary m-l-8"
          (click)="addUser()"
          pButton
          pRipple
          label="Add User"
        ></button>
      </div>
      <div class="card p-0 mt-4">
        @if (usersPageQuery.isPending()) {
          <p>Loading...</p>
        } @else if (usersPageQuery.isError()) {
          <span> Error</span>
        } @else {
          <div class="items-center">
            <ag-grid-angular
              class="ag-theme-alpine border-round"
              [rowData]="usersPageQuery.data()?.items"
              [columnDefs]="columnDefs"
              (rowClicked)="handleRowClicked($event)"
              style="width: 100%; height: 400px;"
            />
            <div class="flex-auto">
              <p-paginator
                [first]="1"
                [rows]="20"
                [totalRecords]="usersPageQuery.data()?.total || 0"
                (onPageChange)="onPageChange($event)"
              />
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class UsersPageComponent {
  #dialogService = inject(DialogService);

  columnDefs: Array<ColDef> = [
    { field: 'name' },
    { field: 'age' },
    { field: 'email' },
    { field: 'company' },
    { field: 'title' },
    { field: 'createdAt' },
    { field: 'updatedAt' },
  ];
  ref: DynamicDialogRef | undefined;

  currentPage = signal(1);

  usersRequestOptions = computed(() => {
    return {
      pagination: {
        limit: 10,
        page: this.currentPage(),
      },
      orderBy: 'createdAt',
      orderDirection: 'ASC',
    } as RequestOptions;
  });

  usersPageQuery = usersQuery.page(this.usersRequestOptions);

  public addUser() {
    this.ref = this.#dialogService.open(ManageUsersDialogComponent, {
      header: 'Create a new user',
      width: '50vw',
      modal: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
    });
  }

  public onPageChange(event: PaginatorState) {
    this.currentPage.update(() => (event.page ? event.page + 1 : 1));
  }

  public handleRowClicked(event: RowClickedEvent<User>) {
    this.ref = this.#dialogService.open(ManageUsersDialogComponent, {
      header: 'Edit user',
      width: '50vw',
      modal: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
      data: { id: event.data?.id },
    });
  }
}

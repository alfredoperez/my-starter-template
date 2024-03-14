import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColDef } from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';
import { UsersApiService } from '@my/users/data';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { PaginatorState } from 'primeng/paginator/paginator.interface';
import { RippleModule } from 'primeng/ripple';
import {
  DialogService,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { ManageUsersDialogComponent } from './manage-users-dialog.component';
import { RequestOptions } from '@my/shared/data';
import {
  injectQuery,
  keepPreviousData,
} from '@tanstack/angular-query-experimental';

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
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-semibold">Users</h1>
          <button
              pButton
              pRipple
              class="p-button-secondary m-l-8"
              (click)="addUser()"
              label="Add User"
          ></button>
        </div>
        <div class="card p-0 mt-4">
          @if (phrasesQuery.isPending()) {
            <p>Loading...</p>
          } @else if (phrasesQuery.isError()) {
            <span> Error</span>
          } @else {
            <div class="items-center">
              <ag-grid-angular
                  class="ag-theme-alpine border-round"
                  [rowData]="phrasesQuery.data()?.items"
                  [columnDefs]="columnDefs"
                  style="width: 100%; height: 400px;"
              />
              <div class="flex-auto">
                <p-paginator
                    (onPageChange)="onPageChange($event)"
                    [first]="1"
                    [rows]="20"
                    [totalRecords]="phrasesQuery.data()?.total || 0"
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
  #usersApiService = inject(UsersApiService);

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
        limit: 20,
        page: this.currentPage(),
      },
      orderBy: 'createdAt',
      orderDirection: 'ASC',
    } as RequestOptions;
  });

  phrasesQuery = injectQuery(() => ({
    queryKey: ['users', this.usersRequestOptions()],
    queryFn: () => this.#usersApiService.fetchPage(this.usersRequestOptions()),
    placeholderData: keepPreviousData,
    staleTime: 5000,
  }));

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
}

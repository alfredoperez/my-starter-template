import { Component, inject } from '@angular/core';
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
import { BehaviorSubject, switchMap } from 'rxjs';

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
              class="p-button-secondary"
              (click)="addUser()"
              label="Add User"
          ></button>
        </div>
        <div class="card p-0 mt-4">

          @if (phrasesQuery$ | async; as query) {
            @if (query.isFetched) {
              <div class="items-center">
                <ag-grid-angular
                    class="ag-theme-alpine border-round"
                    [rowData]="query.data?.items"
                    [columnDefs]="columnDefs"
                    style="width: 100%; height: 500px;"
                />
                <div class="flex-auto">
                  <p-paginator
                      (onPageChange)="onPageChange($event)"
                      [first]="1"
                      [rows]="20"
                      [totalRecords]="query.data?.total || 0"
                  />
                </div>
              </div>
            }

          }
        </div>
      </div>
    `,
})
export class UsersPageComponent {
  #dialogService = inject(DialogService);
  #usersService = inject(UsersApiService);

  public columnDefs: Array<ColDef> = [
    { field: 'name' },
    { field: 'age' },
    { field: 'email' },
    { field: 'company' },
    { field: 'title' },
    { field: 'createdAt' },
    { field: 'updatedAt' },
  ];
  currentPage = new BehaviorSubject<number>(1);

  ref: DynamicDialogRef | undefined;
  phrasesQuery$ = this.currentPage.asObservable().pipe(
    switchMap((page) =>
      this.#usersService.queryPage({
        pagination: {
          limit: 20,
          page,
        },
        orderBy: 'name',
        orderDirection: 'ASC',
      })
    )
  );
  // usersQ = this.#usersService.queryPage({
  //   pagination: {
  //     limit: 20,
  //     page: this.currentPage(),
  //   },
  //   orderBy: 'name',
  //   orderDirection: 'ASC',
  // });

  addUser() {
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

  onPageChange(event: PaginatorState) {
    console.log('page changed', event.page);
    if (event.page) {
      this.currentPage.next(event.page + 1);
    }
    // this.currentPage(event.first / event.rows + 1);
    // this.pageSize(event.rows);
  }
}

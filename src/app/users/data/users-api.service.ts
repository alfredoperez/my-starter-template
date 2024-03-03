import { Injectable } from '@angular/core';
import { ApiService } from '@my/shared/data';
import { User } from './users.models';

@Injectable({ providedIn: 'root' })
export class UsersApiService extends ApiService<User> {
  constructor() {
    super('users');
  }
}

import { inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ListResponse, Pagination, RequestOptions } from './api.models';
import { lastValueFrom, map, Observable, tap } from 'rxjs';
import {
  injectQuery,
  injectQueryClient,
  keepPreviousData,
} from '@ngneat/query';

export abstract class ApiService<T> {
  #httpClient = inject(HttpClient);
  #query = injectQuery();
  #queryClient = injectQueryClient();

  protected constructor(private entityName: string) {}

  public fetchPage(
    requestOptions?: Partial<RequestOptions>
  ): Observable<ListResponse<T>> {
    return this.request<Array<T>>('GET', {
      ...requestOptions,
      observe: 'response',
    }).pipe(
      map((res) =>
        this.mapListResponse(
          res as unknown as HttpResponse<T>,
          requestOptions?.pagination
        )
      )
    );
  }

  public fetchById(
    id: number,
    requestOptions?: Partial<RequestOptions>
  ): Observable<T> {
    return this.request('GET', requestOptions, undefined, id);
  }

  public create(
    body: Partial<T>,
    requestOptions?: Partial<RequestOptions>
  ): Observable<T | null> {
    return this.request('POST', requestOptions, body);
  }

  public update(
    id: number,
    body: Partial<T>,
    requestOptions?: Partial<RequestOptions>
  ): Observable<T> {
    return this.request('PATCH', requestOptions, body, id);
  }

  public queryPage(options: Partial<RequestOptions>) {
    console.log({ options });
    const { searchQuery, pagination, orderDirection, orderBy } = options;

    return this.#query({
      staleTime: options?.staleTime || 0,
      // select: options?.select,
      queryKey: [
        this.entityName,
        { searchQuery, pagination, orderDirection, orderBy },
      ],
      placeholderData: keepPreviousData,
      queryFn: () => {
        return this.fetchPage(options).pipe(
          tap((listResponse) => {
            if (!(listResponse.hasMore && pagination?.page !== undefined)) {
              return;
            }
            //  this.prefetchPage(pagination.page + 1, options);
          })
        );
      },
    }).result$;
  }

  protected prefetchPage(
    nextPage: number,
    options: Partial<RequestOptions> = {}
  ) {
    const { searchQuery, pagination, orderDirection } = options;

    if (!pagination) {
      return;
    }
    pagination.page = nextPage;

    return this.#queryClient.prefetchQuery({
      queryKey: [this.entityName, { pagination, searchQuery }],
      queryFn: () => {
        return lastValueFrom(this.fetchPage(options));
      },
    });
  }

  protected request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    options?: Partial<RequestOptions>,
    body?: unknown,
    id?: number
  ): Observable<T> {
    return this.#httpClient.request(
      method,
      this.getUrl(id),
      this.getOptions(options, body)
    );
  }

  private getUrl(id?: number) {
    const idPath = !id ? '' : `/${id}`;
    return `http://localhost:3000/${this.entityName}${idPath}`;
  }

  private getOptions(options?: Partial<RequestOptions>, body?: unknown) {
    let params = {};
    if (options && options.pagination) {
      const { limit, page, sort, order } = options.pagination;
      const paginationParams = {
        _limit: limit?.toString(),
        _page: (page ? page - 1 : 0).toString(),
        _sort: `${order === 'ASC' ? '' : '-'}${sort}`,
      };

      params = { ...paginationParams };
    }

    return {
      params,
      body,
      observe: options?.observe || 'body',
    };
  }

  private mapListResponse(
    response: HttpResponse<unknown>,
    pagination?: Partial<Pagination>
  ): ListResponse<T> {
    if (!response.headers) {
      return {} as ListResponse<T>;
    }
    const total = Number(response.headers.get('X-Total-Count'));
    let hasMore = false;
    if (pagination) {
      const { limit, page } = pagination;
      if (limit && page) {
        hasMore = total > limit * (page + 1);
      }
    }

    return {
      items: response.body,
      total,
      hasMore,
      pagination,
    } as ListResponse<T>;
  }
}

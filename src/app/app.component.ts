import { Component } from '@angular/core';
import { PageContainerComponent } from './shared/ui';
import { RippleModule } from 'primeng/ripple';
import { AngularQueryDevtools } from '@tanstack/angular-query-devtools-experimental';

@Component({
  standalone: true,
  imports: [PageContainerComponent, RippleModule, AngularQueryDevtools],
  selector: 'starter-root',
  template: `
      <div class="layout-container">
        <angular-query-devtools initialIsOpen/>
        <page-container/>
      </div>
    `,
})
export class AppComponent {}

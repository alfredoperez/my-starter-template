import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'page-container',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: ` 
    <div class="layout-content-wrapper">
        <div class="layout-content">
            <router-outlet></router-outlet>
        </div>
    </div>
   `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageContainerComponent {}

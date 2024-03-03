import { Component } from '@angular/core';
import { PageContainerComponent } from './shared/ui';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
  standalone: true,
  imports: [PageContainerComponent, RippleModule],
  selector: 'starter-root',
  template: `
   <div class="layout-container">
   
   <button 
          pButton
          pRipple
          class="p-button-secondary"
      
          label="Add User"
        ></button>
   <page-container/>
   
</div>
  `,
})
export class AppComponent {}

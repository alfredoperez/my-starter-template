import { Component, computed, input, output } from '@angular/core';
import { ButtonSize, ButtonType } from './button.models';

@Component({
  selector: 'ui-button',
  standalone: true,
  template: `
    <button [class]="buttonClass()" (click)="handleClick()">
      <ng-content />
    </button>
  `,
})
export class ButtonComponent {
  size = input<ButtonSize>('md');
  type = input<ButtonType>('primary');

  buttonClass = computed(() => {
    var className = 'btn';
    const size = this.size();
    const type = this.type();

    if (size !== 'md') {
      className += ` btn-${size} `;
    }
    className += ` btn-${type} `;

    return className;
  });

  click = output();

  handleClick() {
    this.click.emit;
  }
}

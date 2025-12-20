import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-drawer',
  imports: [CommonModule, DrawerModule, ButtonModule],
  templateUrl: './side-drawer.html',
})
export class SideDrawer {
  /** Position: 'left' | 'right' | 'top' | 'bottom' */
  @Input() position: 'left' | 'right' | 'top' | 'bottom' = 'right';
  @Input() visible = false;
  @Input() title = '';

  @Output() save = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  onSave() {
    this.save.emit();
    this.visible = false;
  }

  onClose() {
    this.close.emit();
    this.visible = false;
  }

  handleOnHide() {
    this.close.emit();
  }
}

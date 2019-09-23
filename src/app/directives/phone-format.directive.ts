import {Directive, ElementRef, HostListener} from '@angular/core';
import {RenderingFormatter} from '@angular/compiler-cli/ngcc/src/rendering/rendering_formatter';

const FORMAT = '+380(__) ___-__-__';
const MAX_LENGTH = 9;

@Directive({
  selector: '[appPhoneFormat]',
})
export class PhoneFormatDirective {
  number = '';

  constructor(public connectedInput: ElementRef) {}

  @HostListener('ionKeydown', ['$event.key', '$event.target', '$event'])
  @HostListener('keydown', ['$event.key', '$event.target', '$event'])
  onKeyDown(key, target, event) {
    event.preventDefault();
    if (!/^[0-9]$|^Backspace$/.test(key)) {
      return false;
    }
    if (key === 'Backspace') {
      if (this.number.length > 0) {
        this.number = this.number.substring(0, this.number.length - 1);
      }
    } else if (this.number.length < MAX_LENGTH) {
      this.number += key;
    }
    target.value = this.applyFormatting();
    this.connectedInput.nativeElement.value = this.applyFormatting();
    const pos = target.value.indexOf('_') > -1 ? target.value.indexOf('_') : 18;
    target.setSelectionRange(pos, pos);
    return false;
  }

  @HostListener('ionFocus', ['$event.target'])
  async onFocus(input) {
    if (this.number.length === 0) {
      input.value = FORMAT;
    }
  }

  @HostListener('select', ['$event.target'])
  @HostListener('click', ['$event.target'])
  onSelectClick(input) {
    const pos = input.value.indexOf('_') > -1 ? input.value.indexOf('_') : 18;
    input.setSelectionRange(pos, pos);
  }

  @HostListener('ionBlur', ['$event.target'])
  onBlur(input) {
    if (this.number.length === 0) {
      input.value = '';
    }
  }

  applyFormatting(): string {
    const numbers = this.number.split('');
    let result = FORMAT;
    for (const num of numbers) {
      result = result.replace('_', num);
    }
    return result;
  }
}

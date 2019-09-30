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

  @HostListener('input', ['$event'])
  onInput(event) {
    event.preventDefault();
    const key = event.data;
    if (event.inputType === 'deleteContentBackward') {
      if (this.number.length > 0) {
        this.number = this.number.substring(0, this.number.length - 1);
      }
    } else if (/^[0-9]$/.test(key) && this.number.length < MAX_LENGTH) {
      this.number = this.number.concat(key);
    }
    event.target.value = this.applyFormatting();
    this.connectedInput.nativeElement.value = this.applyFormatting();
    const pos = event.target.value.indexOf('_') > -1 ? event.target.value.indexOf('_') : 18;
    event.target.setSelectionRange(pos, pos);
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

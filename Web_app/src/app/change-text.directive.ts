import { Directive, ElementRef, Input, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appChangeText]'
})
export class ChangeTextDirective implements AfterViewInit {
  @Input() size: string;
  @Input() text: string;
  constructor(Element: ElementRef) { }

  ngAfterViewInit(): void {

  }
}
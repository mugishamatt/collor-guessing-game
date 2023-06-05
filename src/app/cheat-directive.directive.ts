import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[cheating]'
})
export class CheatDirectiveDirective {

  constructor() { }
@Input () cheating: string=" "
  @HostListener('dblclick')foo(){
   alert(`color:${this.cheating}`)
  }

}

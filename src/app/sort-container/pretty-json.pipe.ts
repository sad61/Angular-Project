import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prettyJson',
})
export class PrettyJsonPipe implements PipeTransform {
  transform(value: any): string {
    console.log(value);
    return JSON.stringify(value, null, 2);
  }
}

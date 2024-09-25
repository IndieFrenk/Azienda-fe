import { NativeDateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${this.addLeadingZero(day)}-${this.addLeadingZero(month)}-${year}`;
    }
    return date.toDateString();
  }

  private addLeadingZero(value: number): string {
    return value < 10 ? `0${value}` : value.toString();
  }
}

export const CUSTOM_DATE_FORMATS = {
  parse: {
    dateInput: 'DD-MM-AAAA',
  },
  display: {
    dateInput: 'input',
    monthYearLabel: 'MMM AAAA',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM AAAA',
  },
};
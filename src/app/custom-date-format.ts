import { MatDateFormats, MAT_DATE_FORMATS } from '@angular/material/core';

export const MY_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'DD/MM/AAAA',
  },
  display: {
    dateInput: 'DD/MM/AAAA',
    monthYearLabel: 'MMM AAAA',
    dateA11yLabel: 'DD/MM/AAAA',
    monthYearA11yLabel: 'MMMM AAAA',
  },
};

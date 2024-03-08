import { useDateFormat } from '@vueuse/core';

export function useFormattedDate(date: Date, formatStr = 'D MMM YYYY, H:mm:ss') {
  return useDateFormat(date, formatStr).value;
}

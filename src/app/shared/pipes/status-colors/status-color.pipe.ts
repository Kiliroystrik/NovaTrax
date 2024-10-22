import { Pipe, PipeTransform } from '@angular/core';
import { StatusName } from '../../../features/status/enums/StatusName';
import { StatusType } from '../../../features/status/enums/StatusType';
import { STATUS_COLOR_MAP } from './status-color-mp.contant';

@Pipe({
  name: 'statusColor',
  standalone: true,
})
export class StatusColorPipe implements PipeTransform {
  transform(statusName: string, statusType: string): string {
    const typeMap =
      STATUS_COLOR_MAP[statusType as keyof typeof STATUS_COLOR_MAP];
    if (typeMap && typeMap[statusName as keyof typeof typeMap]) {
      return typeMap[statusName as keyof typeof typeMap]!;
    }
    return 'badge-ghost'; // Classe par défaut
  }
}

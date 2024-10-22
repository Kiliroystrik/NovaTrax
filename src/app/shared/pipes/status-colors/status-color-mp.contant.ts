import { StatusName } from '../../../features/status/enums/StatusName';
import { StatusType } from '../../../features/status/enums/StatusType';

export const STATUS_COLOR_MAP: {
  [key in StatusType]: { [key in StatusName]?: string };
} = {
  ClientOrder: {
    [StatusName.Pending]: 'badge-primary',
    [StatusName.Confirmed]: 'badge-info',
    [StatusName.Cancelled]: 'badge-neutral',
    [StatusName.Completed]: 'badge-success',
  },
  Delivery: {
    [StatusName.Scheduled]: 'badge-secondary',
    [StatusName.InTransit]: 'badge-info',
    [StatusName.Delivered]: 'badge-success',
    [StatusName.Failed]: 'badge-error',
  },
  Tour: {
    [StatusName.Planned]: 'badge-primary',
    [StatusName.InProgress]: 'badge-info',
    [StatusName.Completed]: 'badge-success',
    [StatusName.Cancelled]: 'badge-neutral',
  },
};

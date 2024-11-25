/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
import { SetMetadata } from '@nestjs/common';

export const Permission = (action: string, entity: any) =>
  SetMetadata('permission', `${entity.entityName}:${action}`);

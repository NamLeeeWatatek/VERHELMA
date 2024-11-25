/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Transform } from 'class-transformer';

/**
 * Custom decorator to transform 'true'/'false' strings to boolean values.
 */
export function ToBoolean(): PropertyDecorator {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      // eslint-disable-next-line unicorn/no-nested-ternary
      return value === 'true' ? true : value === 'false' ? false : value;
    }

    return value;
  });
}

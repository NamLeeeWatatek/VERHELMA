/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Transform, TransformationType } from 'class-transformer';
import { parsePhoneNumber } from 'libphonenumber-js';
import { castArray, isArray, map, trim } from 'lodash';

import { GeneratorProvider } from '../providers';

/**
 * @description trim spaces from start and end, replace multiple spaces with one.
 * @example
 * @ApiProperty()
 * @IsString()
 * @Trim()
 * name: string;
 * @returns PropertyDecorator
 * @constructor
 */
export function Trim(): PropertyDecorator {
  return Transform((params) => {
    const value = params.value as string[] | string | undefined;

    if (isArray(value)) {
      return map(value, (v) => trim(v).replaceAll(/\s\s+/g, ' '));
    }

    if (typeof value === 'string') {
      return trim(value).replaceAll(/\s\s+/g, ' ');
    }

    return value;
  });
}

export function ToBoolean(): PropertyDecorator {
  return Transform(
    (params) => {
      const value = params.value as string | boolean | undefined;

      if (value === 'true') {
        return true;
      }

      if (value === 'false') {
        return false;
      }

      return value;
    },
    { toClassOnly: true },
  );
}

/**
 * @description convert string or number to integer
 * @example
 * @IsNumber()
 * @ToInt()
 * name: number;
 * @returns PropertyDecorator
 * @constructor
 */
export function ToInt(): PropertyDecorator {
  return Transform(
    (params) => {
      const value = params.value as string | undefined;

      if (typeof value === 'string') {
        return Number.parseInt(value, 10);
      }

      return value;
    },
    { toClassOnly: true },
  );
}

/**
 * @description transforms to array, specially for query params
 * @example
 * @IsNumber()
 * @ToArray()
 * name: number;
 * @constructor
 */
export function ToArray(): PropertyDecorator {
  return Transform(
    (params): unknown[] | undefined => {
      const value = params.value;

      if (!value) {
        return value;
      }

      return castArray(value);
    },
    { toClassOnly: true },
  );
}

export function ToLowerCase(): PropertyDecorator {
  return Transform(
    (params) => {
      const value = params.value as string | string[] | undefined;

      if (!value) {
        return;
      }

      if (typeof value === 'string') {
        return value.toLowerCase();
      }

      return value.map((v) => v.toLowerCase());
    },
    {
      toClassOnly: true,
    },
  );
}

export function ToUpperCase(): PropertyDecorator {
  return Transform(
    (params) => {
      const value = params.value as string | string[] | undefined;

      if (!value) {
        return;
      }

      if (typeof value === 'string') {
        return value.toUpperCase();
      }

      return value.map((v) => v.toUpperCase());
    },
    {
      toClassOnly: true,
    },
  );
}

export function S3UrlParser(): PropertyDecorator {
  return Transform((params) => {
    const key = params.value as string | undefined;

    if (!key) {
      return key;
    }

    switch (params.type) {
      case TransformationType.CLASS_TO_PLAIN: {
        return GeneratorProvider.getS3PublicUrl(key);
      }

      case TransformationType.PLAIN_TO_CLASS: {
        return GeneratorProvider.getS3Key(key);
      }

      default: {
        return key;
      }
    }
  });
}

export function PhoneNumberSerializer(): PropertyDecorator {
  return Transform((params) => {
    const value = params.value as string | undefined;

    if (!value) {
      return value;
    }

    return parsePhoneNumber(value).number;
  });
}

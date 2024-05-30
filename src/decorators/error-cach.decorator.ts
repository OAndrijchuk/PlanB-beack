import { InternalServerErrorException } from '@nestjs/common';

export const TryCatchWrapper =
  () =>
  (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return originalMethod.apply(this, args);
      } catch (error) {
        throw new InternalServerErrorException(
          `Server error! ${error.message}`,
        );
      }
    };
  };

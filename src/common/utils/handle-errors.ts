import { Prisma } from '@prisma/client';

export function handleErrors(error: unknown) {
  console.error(error);

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return {
      success: false,
      data: null,
      error: {
        code: error.code,
        message: error.message,
        meta: error.meta,
      },
    };
  }

  if (error instanceof Error) {
    return {
      success: false,
      data: null,
      error: {
        message: error.message,
      },
    };
  }

  return {
    success: false,
    data: null,
    error: {
      message: 'An unknown error occurred',
    },
  };
}

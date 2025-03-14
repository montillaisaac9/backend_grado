import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaErrorCode, PrismaErrorMessages } from '../enums/codeErrorPrisma'; // Asegúrate de tener el archivo con los códigos de error
import { IResponse } from '../interfaces/response.interface';

export function handleErrors<T>(error: unknown): IResponse<T> {
  console.log(error);
  if (error instanceof BadRequestException) {
    throw error;
  }
  if (error instanceof PrismaClientKnownRequestError) {
    const errorMessage =
      PrismaErrorMessages[error.code as PrismaErrorCode] || 'Database error';

    const errorCode = error.code as PrismaErrorCode;
    switch (errorCode) {
      case PrismaErrorCode.UniqueConstraintViolation:
      case PrismaErrorCode.RecordNotFound:
      case PrismaErrorCode.ForeignKeyConstraintViolation:
      case PrismaErrorCode.InvalidFieldValue:
      case PrismaErrorCode.RelationDoesNotExist:
        throw new BadRequestException(errorMessage);

      case PrismaErrorCode.QueryTimeout:
        throw new InternalServerErrorException(errorMessage);

      default:
        throw new InternalServerErrorException(
          PrismaErrorMessages[PrismaErrorCode.UnhandledError] ||
            'Unhandled database error',
        );
    }
  }
  throw new InternalServerErrorException('Unexpected server error');
}

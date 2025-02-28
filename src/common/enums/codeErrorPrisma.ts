export enum PrismaErrorCode {
  UniqueConstraintViolation = 'P2002', // Unique constraint violation (e.g., duplicate email or other unique field)
  RecordNotFound = 'P2025', // Record not found in the database
  ForeignKeyConstraintViolation = 'P2003', // Foreign key constraint violation
  InvalidFieldValue = 'P2000', // Invalid field value passed (e.g., invalid type)
  QueryTimeout = 'P2024', // Query timed out
  UnhandledError = 'P2001', // Unhandled error, typically used for other cases
  RelationDoesNotExist = 'P2019', // A relation does not exist or is misconfigured
}

export const PrismaErrorMessages = {
  [PrismaErrorCode.UniqueConstraintViolation]:
    'The value already exists, violating a unique constraint.',
  [PrismaErrorCode.RecordNotFound]: 'The requested record could not be found.',
  [PrismaErrorCode.ForeignKeyConstraintViolation]:
    'A foreign key constraint violation occurred.',
  [PrismaErrorCode.InvalidFieldValue]:
    'One of the field values is invalid or malformed.',
  [PrismaErrorCode.QueryTimeout]: 'The query has timed out.',
  [PrismaErrorCode.UnhandledError]: 'An unexpected database error occurred.',
  [PrismaErrorCode.RelationDoesNotExist]:
    'The specified relation does not exist.',
};

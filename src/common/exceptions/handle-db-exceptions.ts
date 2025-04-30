import { BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';

const logger = new Logger('DBExceptionHandler');

export function handleDBExceptions(error: any): never {
  if (error.code === '23505') {
    throw new BadRequestException(`Error code "23505": ${error.detail}`);
  }

  logger.error(error);
  throw new InternalServerErrorException('Unexpected error, check server logs');
}
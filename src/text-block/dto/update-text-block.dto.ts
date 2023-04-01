import { PartialType } from '@nestjs/swagger';
import { CreateTextBlockDto } from './create-text-block.dto';

export class UpdateTextBlockDto extends PartialType(CreateTextBlockDto) {}

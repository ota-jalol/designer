import { IsString, IsOptional, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class LayoutItemDto {
  @IsString()
  id: string;

  @IsString()
  componentType: string;

  @IsNumber()
  x: number;

  @IsNumber()
  y: number;

  @IsNumber()
  w: number;

  @IsNumber()
  h: number;

  @IsOptional()
  props?: Record<string, unknown>;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LayoutItemDto)
  children?: LayoutItemDto[];
}

export class SaveLayoutDto {
  @IsString()
  projectId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LayoutItemDto)
  layout: LayoutItemDto[];
}

export class UpdateLayoutDto {
  @IsString()
  projectId: string;

  @ValidateNested()
  @Type(() => LayoutItemDto)
  item: LayoutItemDto;
}

export class GenerateCodeDto {
  @IsString()
  projectId: string;

  @IsOptional()
  @IsString()
  format?: 'vue' | 'html';
}

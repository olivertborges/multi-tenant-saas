import { IsString, IsOptional, IsObject, Matches } from 'class-validator';

export class CreateTenantDto {
  @IsString()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'El slug solo puede contener letras minúsculas, números y guiones',
  })
  slug: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsObject()
  config?: Record<string, any>;
}

export class UpdateTenantDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsObject()
  config?: Record<string, any>;

  @IsOptional()
  @IsString()
  status?: string;
}

import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Centros } from 'src/centros.enum';

export class CreateEmpleadoDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  surname: string;

  @IsEnum(Centros)
  center: Centros;

  @IsNotEmpty()
  @IsString()
  bu: string;

  @IsOptional()
  skills: string[];

  @IsOptional()
  project: string;
}

import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Centros } from 'src/centros.enum';

export class CreateEmpleadoDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  apellidos: string;

  @IsEnum(Centros)
  centro: Centros;

  @IsNotEmpty()
  @IsString()
  BU: string;

  @IsOptional()
  skills: string[];

  @IsOptional()
  proyecto_actual: string;
}

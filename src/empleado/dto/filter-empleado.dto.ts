import { Centros } from '../../centros.enum';

export class FilterEmpleadoDto {
  center?: Centros;
  bu?: string;
  skills?: string[];
  project?: string;
}

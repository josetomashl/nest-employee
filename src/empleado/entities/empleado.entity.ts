import { Centros } from 'src/centros.enum';

export class Empleado {
  id: number;
  name: string;
  surname: string;
  center: Centros;
  bu: string;
  skills?: string[];
  project?: string;
}

import { Centros } from 'src/centros.enum';

export class Empleado {
  id: number;
  nombre: string;
  apellidos: string;
  centro: Centros;
  BU: string;
  skills?: string[];
  proyecto_actual?: string;
}

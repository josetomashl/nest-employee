import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { Empleado } from './entities/empleado.entity';

@Injectable()
export class EmpleadoService {
  private empleados: Empleado[] = [];

  create(createEmpleadoDto: CreateEmpleadoDto): Empleado {
    let id = 0;
    if (this.empleados && this.empleados.length) {
      id = this.empleados.length;
    }
    const empleado: Empleado = { id, ...createEmpleadoDto };
    this.empleados.push(empleado);
    return empleado;
  }

  parseCsv(csvData: string): Empleado[] {
    const [fields, ...data] = csvData.split('\n');
    const fieldsName: string[] = fields.split(',');
    const fieldsData: any[][] = data.map((row) => row.split(','));

    // TODO: last element from csv is [ '' ], and it is parsed wrong, need to check and avoid parsing
    // last.length = 1
    // last[0].length = 0
    // basicamente quitarlo del array con un splice() o pop()...
    const last = fieldsData[fieldsData.length - 1];
    console.log(last.length, !last.length);

    const empleados: { [key: string]: any }[] = [];

    fieldsData.forEach((row) => {
      const empleado: { [key: string]: any } = fieldsName.reduce(
        (acc, key, index) => {
          acc[key] = row[index];
          return acc;
        },
        {},
      );
      empleados.push(empleado);
    });
    return empleados as Empleado[];
  }

  findAll(): Empleado[] {
    return this.empleados;
  }

  findOne(id: number): Empleado {
    const empleado: Empleado = this.empleados.find(
      (empleado) => empleado.id === id,
    );
    if (!empleado) throw new NotFoundException();
    return empleado;
  }

  update(id: number, createEmpleadoDto: CreateEmpleadoDto): Empleado {
    const index = this.empleados.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.empleados[index] = {
        id: this.empleados[index].id,
        name: createEmpleadoDto.name,
        surname: createEmpleadoDto.surname,
        center: createEmpleadoDto.center,
        bu: createEmpleadoDto.bu,
        skills: createEmpleadoDto.skills,
        project: createEmpleadoDto.project,
      };
      return this.empleados[index];
    } else {
      throw new NotFoundException();
    }
  }

  remove(id: number): void {
    this.findOne(id);
    this.empleados = this.empleados.filter((emp) => emp.id !== id);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { Empleado } from './entities/empleado.entity';

@Injectable()
export class EmpleadoService {
  private empleados: Empleado[] = [];

  create(createEmpleadoDto: CreateEmpleadoDto): Empleado {
    let id = 0;
    if (this.empleados && this.empleados.length) {
      id = this.empleados[this.empleados.length - 1].id + 1;
    }
    const empleado: Empleado = { id, ...createEmpleadoDto };
    this.empleados.push(empleado);
    return empleado;
  }

  parseCsv(csvData: string): Empleado[] {
    const data = csvData.split('\n').splice(1, csvData.split('\n').length - 1);
    console.log(data);

    const fieldsData: any[][] = data.map((row) => row.split(','));

    const last = fieldsData[fieldsData.length - 1];
    if (!last || !last.length || !last[0] || !last[0].length) {
      fieldsData.pop();
    }

    const empleadosCSV: Empleado[] = [];

    fieldsData.forEach((row) => {
      const newEmpleado: Empleado = {
        id: Number(row[0]),
        name: row[1],
        surname: row[2],
        center: row[3],
        bu: row[4],
        skills: row[5].split(' '),
        project: row[6],
      };
      empleadosCSV.push(newEmpleado);
    });
    this.empleados.push(...empleadosCSV);
    return empleadosCSV;
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

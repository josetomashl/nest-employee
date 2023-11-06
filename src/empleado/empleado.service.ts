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
        nombre: createEmpleadoDto.nombre,
        apellidos: createEmpleadoDto.apellidos,
        centro: createEmpleadoDto.centro,
        BU: createEmpleadoDto.BU,
        skills: createEmpleadoDto.skills,
        proyecto_actual: createEmpleadoDto.proyecto_actual,
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

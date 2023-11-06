import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { EmpleadoService } from './empleado.service';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { Empleado } from './entities/empleado.entity';

@Controller('empleado')
export class EmpleadoController {
  constructor(private readonly empleadoService: EmpleadoService) {}

  @Post()
  create(@Body() createEmpleadoDto: CreateEmpleadoDto): Empleado {
    return this.empleadoService.create(createEmpleadoDto);
  }

  @Get()
  findAll(): Empleado[] {
    return this.empleadoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Empleado {
    return this.empleadoService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() createEmpleadoDto: CreateEmpleadoDto,
  ): Empleado {
    return this.empleadoService.update(+id, createEmpleadoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): void {
    return this.empleadoService.remove(+id);
  }
}

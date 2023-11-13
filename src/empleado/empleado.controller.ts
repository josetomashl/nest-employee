import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseInterceptors,
  UploadedFile,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { EmpleadoService } from './empleado.service';
import { CreateEmpleadoDto } from './dto/create-update-empleado.dto';
import { Empleado } from './entities/empleado.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilterEmpleadoDto } from './dto/filter-empleado.dto';

@Controller('empleado')
export class EmpleadoController {
  constructor(private readonly empleadoService: EmpleadoService) {}

  @Post()
  create(@Body() createEmpleadoDto: CreateEmpleadoDto): Empleado {
    return this.empleadoService.create(createEmpleadoDto);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async createMany(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Empleado[]> {
    console.log(file);

    if (!file) throw new BadRequestException();
    const csvData = file.buffer.toString();
    const empleados = this.empleadoService.createMany(csvData);
    return empleados;
  }

  @Get()
  findAll(@Query() filters?: FilterEmpleadoDto): Empleado[] {
    let empleados: Empleado[] = [];
    if (!filters) {
      empleados = this.empleadoService.findAll();
    } else {
      empleados = this.empleadoService.findSome(filters);
    }
    return empleados;
  }

  @Get(':id')
  findOne(@Param('id') id: number): Empleado {
    if (!id || typeof id !== 'number') throw new BadRequestException();
    return this.empleadoService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() createEmpleadoDto: CreateEmpleadoDto,
  ): Empleado {
    if (!id || typeof id !== 'number') throw new BadRequestException();
    return this.empleadoService.update(id, createEmpleadoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): void {
    if (!id || typeof id !== 'number') throw new BadRequestException();
    return this.empleadoService.remove(id);
  }
}

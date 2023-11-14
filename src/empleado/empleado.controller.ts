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
  async create(
    @Body() createEmpleadoDto: CreateEmpleadoDto,
  ): Promise<Empleado> {
    return this.empleadoService.create(createEmpleadoDto);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async createMany(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Empleado[]> {
    if (!file || file.mimetype !== 'text/csv')
      throw new BadRequestException('Format not supported');
    const csvData = file.buffer.toString();
    const empleados = this.empleadoService.createMany(csvData);
    return empleados;
  }

  @Get()
  async findAll(@Query() filters?: FilterEmpleadoDto): Promise<Empleado[]> {
    let empleados: Empleado[] = [];
    if (!filters) {
      empleados = await this.empleadoService.findAll();
    } else {
      empleados = await this.empleadoService.findSome(filters);
    }
    return empleados;
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Empleado> {
    if (!id) throw new BadRequestException();
    return this.empleadoService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() createEmpleadoDto: CreateEmpleadoDto,
  ): Promise<Empleado> {
    if (!id || !createEmpleadoDto) throw new BadRequestException();
    return this.empleadoService.update(id, createEmpleadoDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<string> {
    if (!id) throw new BadRequestException();
    return this.empleadoService.remove(id);
  }
}

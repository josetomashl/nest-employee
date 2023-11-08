import { Test } from '@nestjs/testing';
import { EmpleadoController } from './empleado.controller';
import { EmpleadoService } from './empleado.service';
import { Empleado } from './entities/empleado.entity';
import { Centros } from '../centros.enum';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { FilterEmpleadoDto } from './dto/filter-empleado.dto';

describe('EmpleadoController', () => {
  const empleados: Empleado[] = [
    {
      id: 1,
      name: 'John',
      surname: 'Doe',
      center: Centros.MRUCIA,
      bu: 'test 1',
      skills: ['skill 1', 'skill 2'],
      project: 'project 1',
    },
    {
      id: 2,
      name: 'Lorem',
      surname: 'Ipsum',
      center: Centros.VALENCIA,
      bu: 'test 2',
      skills: ['skill 3', 'skill 2'],
      project: 'project 2',
    },
    {
      id: 3,
      name: 'Any',
      surname: 'One',
      center: Centros.MRUCIA,
      bu: 'test 2',
      skills: ['skill 4', 'skill 5', 'skill 1'],
      project: 'project 1',
    },
  ];

  let empleadoController: EmpleadoController;
  let empleadoService: EmpleadoService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [EmpleadoController],
      providers: [EmpleadoService],
    }).compile();

    empleadoService = await moduleRef.resolve(EmpleadoService);
    empleadoController = moduleRef.get<EmpleadoController>(EmpleadoController);
  });

  describe('findAll', () => {
    it('should return an array of employees', async () => {
      jest
        .spyOn(empleadoService, 'findAll')
        .mockImplementation(() => empleados);
      expect(await empleadoController.findAll(null)).toBe(empleados);
    });
  });

  describe('findAllWithFilters', () => {
    it('should return an array of filtered employees', async () => {
      const filters: FilterEmpleadoDto = {
        bu: 'test 1',
        center: Centros.MRUCIA,
      };
      const result = empleados.filter(
        (emp) => emp.center === 'MURCIA' && emp.bu === 'test 1',
      );
      jest.spyOn(empleadoService, 'findSome').mockImplementation(() => result);
      expect(await empleadoController.findAll(filters)).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return an array of employees', async () => {
      const result = empleados.find((emp) => emp.id === 1);
      jest.spyOn(empleadoService, 'findOne').mockImplementation(() => result);
      expect(await empleadoController.findOne('1')).toBe(result);
    });
  });

  describe('create', () => {
    it('should return an array of employees', async () => {
      const newEmpleado: CreateEmpleadoDto = {
        name: 'New',
        surname: 'Employee',
        center: Centros.VALENCIA,
        bu: 'test 5',
        skills: [],
        project: 'project 5',
      };
      const result: Empleado = {
        id: 4,
        name: 'New',
        surname: 'Employee',
        center: Centros.VALENCIA,
        bu: 'test 5',
        skills: [],
        project: 'project 5',
      };
      jest.spyOn(empleadoService, 'create').mockImplementation(() => result);
      expect(await empleadoController.create(newEmpleado)).toBe(result);
    });
  });

  describe('createMany', () => {
    it('should return an array of employees', async () => {
      // TODO
    });
  });

  describe('update', () => {
    it('should return an updated employee', async () => {
      const result = empleados.find((emp) => emp.id === 1);
      result.name = 'Nombre';
      result.surname = 'Apellido';
      result.bu = 'BU';
      // And more if necessary
      jest.spyOn(empleadoService, 'update').mockImplementation(() => result);
      expect(
        await empleadoController.update('1', result as CreateEmpleadoDto),
      ).toBe(result);
    });
  });

  describe('remove', () => {
    it('should remove an employee', async () => {
      const result = empleados.filter((emp) => emp.id !== 1);
      jest.spyOn(empleadoService, 'remove').mockImplementation(() => result);
      expect(await empleadoController.remove('1')).toBe(result);
    });
  });
});

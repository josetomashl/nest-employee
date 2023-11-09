import { Test } from '@nestjs/testing';
import { EmpleadoController } from './empleado.controller';
import { EmpleadoService } from './empleado.service';
import { Empleado } from './entities/empleado.entity';
import { Centros } from '../centros.enum';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { FilterEmpleadoDto } from './dto/filter-empleado.dto';
import { NotFoundException } from '@nestjs/common';

describe('EmpleadoController test suite', () => {
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
      const actual = await empleadoController.findAll();
      const result = empleados;
      expect(actual).toEqual(result);
    });

    it('should return an empty array', async () => {
      const actual = await empleadoController.findAll();
      const result = [];
      expect(actual).toStrictEqual(result);
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
      const actual = await empleadoController.findAll(filters);
      expect(actual).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return an specific employee', async () => {
      const result = empleados.find((emp) => emp.id === 1);
      jest.spyOn(empleadoService, 'findOne').mockImplementation(() => result);
      const actual = await empleadoController.findOne(1);
      expect(actual).toEqual(result);
    });

    it('should return invalid argument error', async () => {
      try {
        await empleadoController.findOne(undefined);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toHaveProperty('message', 'Invalid argument');
      }
    });

    it('should return not found exception', async () => {
      try {
        await empleadoController.findOne(1);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error).toHaveProperty('message', 'Not Found');
      }
    });
  });

  describe('create', () => {
    it('should return the employee created', async () => {
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
    it.todo('test post employees through a csv file');
    //   it('should return an array of new employees', async () => {
    //     const result: Empleado[] = [
    //       {
    //         id: 1,
    //         name: 'John',
    //         surname: 'Doe',
    //         center: Centros.MRUCIA,
    //         bu: 'test 1',
    //         skills: ['skill 1', 'skill 2'],
    //         project: 'project 1',
    //       },
    //       {
    //         id: 2,
    //         name: 'Lorem',
    //         surname: 'Ipsum',
    //         center: Centros.VALENCIA,
    //         bu: 'test 2',
    //         skills: ['skill 3', 'skill 2'],
    //         project: 'project 2',
    //       },
    //       {
    //         id: 3,
    //         name: 'Any',
    //         surname: 'One',
    //         center: Centros.MRUCIA,
    //         bu: 'test 2',
    //         skills: ['skill 4', 'skill 5', 'skill 1'],
    //         project: 'project 1',
    //       },
    //     ];
    //     const filePath = `../../${__dirname}/assets/files/employees.csv`;
    //     const file = new File([], 'employees.csv', { type: 'text/csv' });
    //     // Test if the test file is exist
    //     fs.access(filePath, fs.constants.F_OK, (error) => {
    //       if (error) throw new Error('File does not exist');
    //       return jest
    //         .spyOn(empleadoService, 'createMany')
    //         .mockImplementation(() => result);
    //     });
    //     jest
    //       .spyOn(empleadoService, 'createMany')
    //       .mockImplementation(() => result);
    //     expect(await empleadoController.createMany(file)).toBe(result);
    //     // TODO
    //   });
  });

  describe('update', () => {
    it('should return an updated employee', async () => {
      const result = empleados.find((emp) => emp.id === 1);
      result.name = 'Nombre';
      result.surname = 'Apellido';
      result.bu = 'BU';
      jest.spyOn(empleadoService, 'update').mockImplementation(() => result);
      expect(
        await empleadoController.update(1, result as CreateEmpleadoDto),
      ).toEqual(result);
    });
  });

  describe('remove', () => {
    it('should remove an employee', async () => {
      const result = empleados.filter((emp) => emp.id !== 1);
      jest.spyOn(empleadoService, 'remove').mockImplementation(() => result);
      expect(await empleadoController.remove(1)).toBe(result);
    });
  });
});

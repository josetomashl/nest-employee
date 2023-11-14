import { Test } from '@nestjs/testing';
import { EmpleadoController } from './empleado.controller';
import { EmpleadoService } from './empleado.service';
import { Empleado } from './entities/empleado.entity';
import { Centros } from '../centros.enum';
import { CreateEmpleadoDto } from './dto/create-update-empleado.dto';
import { FilterEmpleadoDto } from './dto/filter-empleado.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('EmpleadoController test suite', () => {
  const empleados: Empleado[] = [
    {
      id: 1,
      name: 'John',
      surname: 'Doe',
      center: Centros.MURCIA,
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
      center: Centros.MURCIA,
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
    it('should return an empty array', async () => {
      const actual = await empleadoController.findAll();
      const result = [];
      expect(actual).toStrictEqual(result);
    });

    it('should return an array of employees', async () => {
      jest
        .spyOn(empleadoService, 'findAll')
        .mockImplementation(async () => empleados);
      const actual = await empleadoController.findAll();
      const result = empleados;
      expect(actual).toEqual(result);
    });
  });

  describe('findAllWithFilters', () => {
    it('should return an array of filtered employees', async () => {
      const filters: FilterEmpleadoDto = {
        bu: 'test 1',
        center: Centros.MURCIA,
      };
      const result = empleados.filter(
        (emp) => emp.center === 'MURCIA' && emp.bu === 'test 1',
      );
      jest
        .spyOn(empleadoService, 'findSome')
        .mockImplementation(async () => result);
      const actual = await empleadoController.findAll(filters);
      expect(actual).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return an specific employee', async () => {
      const result = empleados.find((emp) => emp.id === 1);
      jest
        .spyOn(empleadoService, 'findOne')
        .mockImplementation(async () => result);
      const actual = await empleadoController.findOne(1);
      expect(actual).toEqual(result);
    });

    it('should return BadRequestException', async () => {
      jest.spyOn(empleadoService, 'findOne').mockImplementation(async () => {
        throw new BadRequestException();
      });
      const actual = empleadoController.findOne(null);
      expect(actual).rejects.toThrow(BadRequestException);
    });

    it('should return NotFoundException', async () => {
      jest.spyOn(empleadoService, 'findOne').mockImplementation(async () => {
        throw new NotFoundException();
      });
      const actual = empleadoController.findOne(1);
      expect(actual).rejects.toThrow(NotFoundException);
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
        id: 1,
        name: 'New',
        surname: 'Employee',
        center: Centros.VALENCIA,
        bu: 'test 5',
        skills: [],
        project: 'project 5',
      };
      jest
        .spyOn(empleadoService, 'create')
        .mockImplementation(async () => result);
      expect(await empleadoController.create(newEmpleado)).toEqual(result);
    });

    it('should return BadRequestException when missing fields', async () => {
      const newEmpleado: CreateEmpleadoDto = {
        name: 'New',
        surname: '',
        center: Centros.VALENCIA,
        bu: 'test 5',
        skills: [],
        project: '',
      };
      jest.spyOn(empleadoService, 'create').mockImplementation(async () => {
        throw new BadRequestException();
      });
      const actual = empleadoController.create(newEmpleado);
      expect(actual).rejects.toThrow(BadRequestException);
    });
  });

  describe('createMany', () => {
    it('test post employees through a csv file', async () => {
      const result: Empleado[] = [
        {
          id: 1,
          name: 'Daron',
          surname: 'Weimann',
          center: Centros.VALENCIA,
          bu: 'Spain',
          skills: ['MongoDB', 'Typescript'],
          project: 'Leannon Thompson and Hahn',
        },
        {
          id: 2,
          name: 'Vada',
          surname: 'Ullrich',
          center: Centros.MURCIA,
          bu: 'Germany',
          skills: ['.NET', 'Java', 'NodeJS', 'MongoDB', 'Typescript'],
          project: 'Leannon Thompson and Hahn',
        },
        {
          id: 3,
          name: 'Mireya',
          surname: 'Farrell',
          center: Centros.MURCIA,
          bu: 'Netherlands',
          skills: ['NodeJS', '.NET', 'Java', 'Typescript'],
          project: 'Wehner - Renner',
        },
        {
          id: 4,
          name: 'Seamus',
          surname: 'Lynch',
          center: Centros.MURCIA,
          bu: 'France',
          skills: ['Java', 'NodeJS', '.NET'],
          project: 'Greenfelder Inc',
        },
        {
          id: 5,
          name: 'Spencer',
          surname: 'Parker',
          center: Centros.MURCIA,
          bu: 'France',
          skills: ['Java', 'Typescript', '.NET'],
          project: 'Leannon Thompson and Hahn',
        },
      ];
      const file = {
        fieldname: 'file',
        originalname: 'employees.csv',
        encoding: '7bit',
        mimetype: 'text/csv',
        buffer: Buffer.from(
          `id,name,surname,center,bu,skills,project\n1,Daron,Weimann,VALENCIA,Spain,MongoDB Typescript,Leannon Thompson and Hahn\n2,Vada,Ullrich,MURCIA,Germany,.NET Java NodeJS MongoDB Typescript,Leannon Thompson and Hahn\n3,Mireya,Farrell,MURCIA,Netherlands,NodeJS .NET Java Typescript,Wehner - Renner\n4,Seamus,Lynch,MURCIA,France,Java NodeJS .NET,Greenfelder Inc\n5,Spencer,Parker,MURCIA,France,Java Typescript .NET,Leannon Thompson and Hahn`,
        ),
        size: 123,
      };
      jest
        .spyOn(empleadoService, 'createMany')
        .mockImplementation(async () => result);
      const actual = await empleadoController.createMany(file as any);
      expect(actual).toEqual(result);
    });

    it('test post employees through a csv file', async () => {
      jest.spyOn(empleadoService, 'createMany').mockImplementation(async () => {
        throw new BadRequestException();
      });
      const actual = empleadoController.createMany({} as any);
      expect(actual).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should return an updated employee', async () => {
      const result = empleados.find((emp) => emp.id === 1);
      result.name = 'Nombre';
      result.surname = 'Apellido';
      result.bu = 'BU';
      jest
        .spyOn(empleadoService, 'update')
        .mockImplementation(async () => result);
      const actual = await empleadoController.update(
        1,
        result as CreateEmpleadoDto,
      );
      expect(actual).toEqual(result);
    });

    it('should return NotFoundException', async () => {
      const result = empleados.find((emp) => emp.id === 1);
      result.name = 'Nombre';
      result.surname = 'Apellido';
      result.bu = 'BU';
      jest.spyOn(empleadoService, 'update').mockImplementation(async () => {
        throw new NotFoundException();
      });
      const actual = empleadoController.update(1, result as CreateEmpleadoDto);
      expect(actual).rejects.toThrow(NotFoundException);
    });

    it('should return BadRequestException', async () => {
      jest.spyOn(empleadoService, 'update').mockImplementation(async () => {
        throw new BadRequestException();
      });
      const actual = empleadoController.update(null, null);
      expect(actual).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should remove an employee', async () => {
      const id = 1;
      const expected = `Employee with ID #${id} deleted succesfully`;
      jest
        .spyOn(empleadoController, 'remove')
        .mockImplementation(async () => expected);
      const actual = await empleadoController.remove(id);
      expect(actual).toBe(expected);
    });

    it('should return BadRequestException', async () => {
      jest.spyOn(empleadoController, 'remove').mockImplementation(async () => {
        throw new BadRequestException();
      });
      const actual = empleadoController.remove(null);
      expect(actual).rejects.toThrow(BadRequestException);
    });

    it('should return NotFoundException', async () => {
      jest.spyOn(empleadoController, 'remove').mockImplementation(async () => {
        throw new NotFoundException();
      });
      const actual = empleadoController.remove(1);
      expect(actual).rejects.toThrow(NotFoundException);
    });
  });
});

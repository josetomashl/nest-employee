import { Module } from '@nestjs/common';
import { EmpleadoModule } from './empleado/empleado.module';

@Module({
  imports: [EmpleadoModule],
})
export class AppModule {}

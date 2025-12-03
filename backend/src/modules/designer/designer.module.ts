import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DesignerController } from './controllers/designer.controller';
import { DesignerService } from './services/designer.service';
import { DesignerGateway } from './gateways/designer.gateway';
import { Project } from './entities/project.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Project]), AuthModule],
  controllers: [DesignerController],
  providers: [DesignerService, DesignerGateway],
  exports: [DesignerService],
})
export class DesignerModule {}


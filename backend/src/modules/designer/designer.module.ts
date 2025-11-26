import { Module } from '@nestjs/common';
import { DesignerController } from './controllers/designer.controller';
import { DesignerService } from './services/designer.service';
import { DesignerGateway } from './gateways/designer.gateway';

@Module({
  controllers: [DesignerController],
  providers: [DesignerService, DesignerGateway],
  exports: [DesignerService],
})
export class DesignerModule {}

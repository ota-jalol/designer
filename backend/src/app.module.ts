import { Module } from '@nestjs/common';
import { DesignerModule } from './modules/designer/designer.module';
import { ComponentsModule } from './modules/components/components.module';

@Module({
  imports: [DesignerModule, ComponentsModule],
})
export class AppModule {}

import { CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class BodyIdCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    const body = request.body;

    // Генерируем ключ на основе ID задачи или любого другого поля из Body
    if (body && body.id) {
      return `cache_id_${body.id}`;
    }

    // Если данных нет, возвращаем стандартный путь (или undefined, чтобы не кэшировать)
    return super.trackBy(context);
  }
}
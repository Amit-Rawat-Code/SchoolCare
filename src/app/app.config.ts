import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth/auth.interceptor';
import { AuthService } from './core/services/auth.service';
import { firstValueFrom } from 'rxjs';

export function initAuth(authService:AuthService){
  return ()=>firstValueFrom(authService.checkAuth());
}

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
  provideRouter(routes),
provideHttpClient(withInterceptors([authInterceptor])),
{
  provide:APP_INITIALIZER,
  useFactory:initAuth,
  deps:[AuthService],
  multi:true
}
]
};

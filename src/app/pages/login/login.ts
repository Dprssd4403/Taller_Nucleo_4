import {
  Component,
  inject
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  AuthService
} from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  email = '';
  password = '';
  error = '';

  private readonly auth = inject(AuthService);

  private readonly router = inject(Router);

  private readonly route = inject(ActivatedRoute);

  iniciarSesion(): void {

    this.error = '';

    if (!this.auth.login(this.email, this.password)) {

      this.error = 'Correo o contraseña incorrectos.';

      return;
    }

    const returnUrl =
      this.route.snapshot.queryParamMap.get('returnUrl');

    if (
      returnUrl &&
      returnUrl.startsWith('/') &&
      !returnUrl.startsWith('//')
    ) {

      void this.router.navigateByUrl(returnUrl);

      return;
    }

    void this.router.navigate([
      this.auth.hasRole('admin')
        ? '/admin'
        : '/catalog'
    ]);
  }
}
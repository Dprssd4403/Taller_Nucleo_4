import { Injectable, signal } from '@angular/core';
import { User, UserRole } from '../models/user.model';

interface DemoCredential extends User {
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly demoUsers: DemoCredential[] = [
    {
      id: 1,
      name: 'Administrador',
      email: 'admin@gmail.com',
      password: 'admin123',
      role: 'admin'
    },
    {
      id: 2,
      name: 'Usuario estándar',
      email: 'usuario@gmail.com',
      password: 'user123',
      role: 'user'
    }
  ];

  readonly currentUser = signal<User | null>(
    this.readSession()
  );

  private readSession(): User | null {
    try {
      const raw = localStorage.getItem(
        'gestion_productos_session'
      );

      if (!raw) return null;

      const user = JSON.parse(raw) as User;

      if (
        !user ||
        !user.email ||
        !['admin', 'user'].includes(user.role)
      ) {
        return null;
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      };

    } catch {
      localStorage.removeItem(
        'gestion_productos_session'
      );

      return null;
    }
  }

  login(email: string, password: string): boolean {

    const found = this.demoUsers.find(user =>
      user.email.toLowerCase() ===
        email.trim().toLowerCase() &&
      user.password === password
    );

    if (!found) return false;

    const safeUser: User = {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role
    };

    this.currentUser.set(safeUser);

    localStorage.setItem(
      'gestion_productos_session',
      JSON.stringify(safeUser)
    );

    return true;
  }

  logout(): void {
    this.currentUser.set(null);

    localStorage.removeItem(
      'gestion_productos_session'
    );
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  hasRole(role: UserRole): boolean {
    return this.currentUser()?.role === role;
  }
}
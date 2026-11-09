import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { ProductService } from '../../core/services/product.service';
import { AuthService } from '../../core/services/auth.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css'
})
export class CatalogComponent implements OnInit {

  private productsService = inject(ProductService);
  private authService = inject(AuthService);
  private router = inject(Router);

  products: Product[] = [];

  loading = false;
  error = '';

  // Nombre del usuario que inició sesión
  get userName(): string {
    return this.authService.currentUser()?.name ?? 'Usuario';
  }

  // Comprobar si el usuario es administrador
  get isAdmin(): boolean {
    return this.authService.currentUser()?.role === 'admin';
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  // Cargar productos desde Firebase
  async loadProducts(): Promise<void> {
    this.loading = true;
    this.error = '';

    try {
      this.products = await this.productsService.getProducts();
    } catch (err: unknown) {
      console.error('Error al cargar productos:', err);
      this.error = 'No se pudieron cargar los productos.';
    } finally {
      this.loading = false;
    }
  }

  // Ir al panel administrativo
  goAdmin(): void {
    this.router.navigate(['/admin']);
  }

  // Cerrar sesión
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
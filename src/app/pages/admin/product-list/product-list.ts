import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ProductService } from '../../../core/services/product.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductAdminComponent implements OnInit {

  private service = inject(ProductService);
  private authService = inject(AuthService);
  private router = inject(Router);

  products: Product[] = [];

  loading = false;
  saving = false;

  error = '';
  success = '';

  editingId: string | null = null;

  product: Product = this.emptyProduct();

  ngOnInit(): void {
    this.loadProducts();
  }

  // Producto vacío
  private emptyProduct(): Product {
    return {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: '',
      image: ''
    };
  }

  // Cargar productos
  async loadProducts(): Promise<void> {
    this.loading = true;
    this.error = '';

    try {
      this.products = await this.service.getProducts();
    } catch (err: unknown) {
      console.error('Error al cargar productos:', err);
      this.error = 'No se pudieron cargar los productos.';
    } finally {
      this.loading = false;
    }
  }

  // Guardar o actualizar producto
  async saveProduct(): Promise<void> {
    this.error = '';
    this.success = '';

    if (!this.product.name.trim()) {
      this.error = 'El nombre del producto es obligatorio.';
      return;
    }

    if (!this.product.category.trim()) {
      this.error = 'La categoría es obligatoria.';
      return;
    }

    if (Number(this.product.price) < 0 ||
        Number(this.product.stock) < 0) {
      this.error = 'El precio y el stock no pueden ser negativos.';
      return;
    }

    this.saving = true;

    try {
      const productData: Product = {
        name: this.product.name.trim(),
        description: this.product.description.trim(),
        price: Number(this.product.price),
        stock: Number(this.product.stock),
        category: this.product.category.trim(),
        image: this.product.image.trim()
      };

      if (this.editingId !== null) {
        await this.service.updateProduct(
          this.editingId,
          productData
        );

        this.success = 'Producto actualizado correctamente.';
      } else {
        await this.service.createProduct(productData);

        this.success = 'Producto creado correctamente.';
      }

      this.resetForm();
      await this.loadProducts();

    } catch (err: unknown) {
      console.error('Error al guardar producto:', err);
      this.error = 'No se pudo guardar el producto.';
    } finally {
      this.saving = false;
    }
  }

  // Editar producto
  editProduct(item: Product): void {
    if (!item.id) {
      this.error = 'El producto no tiene un ID válido.';
      return;
    }

    this.editingId = item.id;

    this.product = {
      name: item.name,
      description: item.description,
      price: item.price,
      stock: item.stock,
      category: item.category,
      image: item.image
    };

    this.error = '';
    this.success = '';
  }

  // Limpiar formulario
  resetForm(): void {
    this.editingId = null;
    this.product = this.emptyProduct();
    this.error = '';
    this.success = '';
  }

  // Alias para cancelar edición
  cancelEdit(): void {
    this.resetForm();
  }

  // Eliminar producto
  async deleteProduct(item: Product): Promise<void> {
    if (!item.id) {
      this.error = 'El producto no tiene un ID válido.';
      return;
    }

    const confirmed = confirm(
      `¿Estás seguro de eliminar ${item.name}?`
    );

    if (!confirmed) {
      return;
    }

    this.error = '';
    this.success = '';

    try {
      await this.service.deleteProduct(item.id);

      this.success = 'Producto eliminado correctamente.';

      await this.loadProducts();

    } catch (err: unknown) {
      console.error('Error al eliminar producto:', err);
      this.error = 'No se pudo eliminar el producto.';
    }
  }

  // Volver al catálogo
  backToCatalog(): void {
    this.router.navigate(['/catalog']);
  }

  // Cerrar sesión
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
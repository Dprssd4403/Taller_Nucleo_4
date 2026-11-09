import { Injectable, inject } from '@angular/core';

import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from '@angular/fire/firestore';

import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private firestore = inject(Firestore);

  private productsCollection =
    collection(this.firestore, 'products');

  // Obtener todos los productos
  async getProducts(): Promise<Product[]> {

    const snapshot = await getDocs(this.productsCollection);

    return snapshot.docs.map(document => ({
      id: document.id,
      ...document.data()
    })) as Product[];
  }

  // Crear producto
  async createProduct(product: Product): Promise<void> {

    const { id, ...productData } = product;

    await addDoc(
      this.productsCollection,
      productData
    );
  }

  // Actualizar producto
  async updateProduct(
    id: string,
    product: Product
  ): Promise<void> {

    const productDocument = doc(
      this.firestore,
      'products',
      id
    );

    const { id: ignoredId, ...productData } = product;

    await updateDoc(
      productDocument,
      productData
    );
  }

  // Eliminar producto
  async deleteProduct(id: string): Promise<void> {

    const productDocument = doc(
      this.firestore,
      'products',
      id
    );

    await deleteDoc(productDocument);
  }
}
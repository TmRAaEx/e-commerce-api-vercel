import { Request, Response } from "express";
import { IProduct } from "../models/IProduct";
import { logError } from "../utilities/logger";

import * as productService from "../services/productService";

export const getProducts = async (_: any, res: Response) => {
  try {
    const products = await productService.getProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: logError(error) });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  const id: string = req.params.id;

  try {
    const product = await productService.getProductById(Number(id));
    console.log(product);

    product
      ? res.status(200).json(product)
      : res.status(404).json({ message: "Product not found" });
  } catch (error) {
    res.status(500).json({ error: logError(error) });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  const { name, description, price, stock, category, image }: IProduct =
    req.body;

  try {
    const insertedProductID = await productService.createProduct(
      name,
      description,
      price,
      stock,
      category,
      image
    );
    res.status(201).json({
      message: "Product created",
      insertedID: insertedProductID,
    });
  } catch (error) {
    res.status(500).json({ error: logError(error) });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const id = req.params.id;
  const {
    name,
    description,
    price,
    regular_price,
    stock,
    category,
    image,
  }: IProduct = req.body;

  try {
    const updatedProduct = await productService.updateProduct(
      name,
      description,
      price,
      regular_price,
      stock,
      category,
      image,
      id
    );

    updatedProduct
      ? res.status(204)
      : res.status(404).json({ message: "Product not found" });
  } catch (error) {
    res.status(500).json({ error: logError(error) });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const deletedProduct = await productService.deleteProduct(Number(id));
    deletedProduct
      ? res.status(204)
      : res.status(404).json({ message: "Product not found" });
  } catch (error) {
    res.status(500).json({ error: logError(error) });
  }
};

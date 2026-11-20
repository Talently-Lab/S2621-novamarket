import mongoose from "mongoose";
import dotenv from "dotenv";

import Category from "../src/models/Category.js";
import Product from "../src/models/Product.js";

dotenv.config();

const categories = [
  "Accesorios para celulares",
  "Gaming y periféricos",
  "Relojes inteligentes",
  "Gadgets y electrónica general"
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Conectado a MongoDB");

    for (const name of categories) {
      await Category.updateOne(
        { name },
        { $setOnInsert: { name, active: true } },
        { upsert: true }
      );
    }

    const gaming = await Category.findOne({
      name: "Gaming y periféricos"
    });

    const products = [
      {
        name: "Mouse Gamer G305",
        description: "Mouse inalámbrico para gaming",
        brand: "Logitech",
        regularPrice: 45000,
        salePrice: 39999,
        category: gaming._id,
        stock: 10,
        images: [],
        specifications: {
          dpi: 12000,
          connectivity: "Wireless",
          buttons: 6
        },
        active: true,
        featured: true
      },
      {
        name: "Teclado Mecánico RGB",
        description: "Teclado mecánico con iluminación RGB",
        brand: "Redragon",
        regularPrice: 65000,
        salePrice: null,
        category: gaming._id,
        stock: 8,
        images: [],
        specifications: {
          connectivity: "USB",
          lighting: "RGB"
        },
        active: true,
        featured: false
      }
    ];

    for (const product of products) {
      await Product.updateOne(
        { name: product.name },
        { $setOnInsert: product },
        { upsert: true }
      );
    }

    console.log("Seed completado correctamente");
    console.log("Categorías:", await Category.countDocuments());
    console.log("Productos:", await Product.countDocuments());

  } catch (error) {
    console.error("Error al ejecutar el seed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seed();
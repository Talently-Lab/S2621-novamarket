import Product from "../src/models/Product.js";

async function testValidations() {
  const invalidProduct = new Product({
    name: "Producto de prueba",
    description: "Producto para probar validaciones",
    brand: "Test",
    regularPrice: -100,
    salePrice: null,
    category: "507f1f77bcf86cd799439011",
    stock: -5,
    images: [],
    specifications: {},
    active: true,
    featured: false
  });

  try {
    await invalidProduct.validate();
    console.log("ERROR: Se aceptó un producto inválido");
  } catch (error) {
    console.log("Validaciones funcionando correctamente");

    for (const field of Object.keys(error.errors)) {
      console.log(`- ${field}: ${error.errors[field].message}`);
    }
  }
}

testValidations();
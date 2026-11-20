import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    brand: {
      type: String,
      required: true,
      trim: true
    },

    regularPrice: {
      type: Number,
      required: true,
      min: 0.01
    },

    salePrice: {
      type: Number,
      default: null,
      validate: {
        validator: function (value) {
          return value == null ||
            (value > 0 && value < this.regularPrice);
        },
        message: "El precio de oferta debe ser menor al precio regular"
      }
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "El stock debe ser un número entero"
      }
    },

    images: {
      type: [String],
      default: [],
      validate: {
        validator: function (images) {
          return images.length <= 5;
        },
        message: "El producto no puede tener más de 5 imágenes"
      }
    },

    specifications: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },

    active: {
      type: Boolean,
      default: true
    },

    featured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
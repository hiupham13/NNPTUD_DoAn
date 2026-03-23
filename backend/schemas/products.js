const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên sản phẩm là bắt buộc'],
      trim: true,
    },
    sku: {
      type: String,
      required: [true, 'Mã SKU là bắt buộc'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Giá sản phẩm là bắt buộc'],
      min: [0, 'Giá không được âm'],
    },
    salePrice: {
      type: Number,
      default: 0,
    },
    images: [
      {
        type: String,
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Danh mục là bắt buộc'],
    },
    collectionRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Collection',
      default: null,
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    discountPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    // Watch-specific fields
    movement: {
      type: String,
      enum: ['automatic', 'mechanical', 'quartz', 'eco-drive', 'solar'],
      default: 'automatic',
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'unisex'],
      default: 'male',
    },
    caseMaterial: {
      type: String,
      default: '',
    },
    caseSize: {
      type: String,
      default: '',
    },
    strapMaterial: {
      type: String,
      default: '',
    },
    waterResistance: {
      type: String,
      default: '',
    },
    features: [
      {
        type: String,
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isNewProduct: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Auto-generate slug and calculate sale price
productSchema.pre('save', function () {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }

  // Optimize Virtual SalePrice -> To Database physical SalePrice for filtering
  if (this.isModified('originalPrice') || this.isModified('discountPercent') || this.isModified('price')) {
    if (this.discountPercent > 0) {
      if (this.originalPrice > 0) {
        this.salePrice = Math.round(this.originalPrice * (1 - this.discountPercent / 100));
        this.price = this.salePrice;
      }
    } else {
      if (this.originalPrice > 0) {
        this.price = this.originalPrice;
        this.salePrice = this.originalPrice;
      } else {
        this.salePrice = this.price;
        this.originalPrice = this.price; 
      }
    }
  }
});

// Exclude soft-deleted products by default
productSchema.pre(/^find/, function () {
  if (this.getFilter().isDeleted === undefined) {
    this.where({ isDeleted: false });
  }
});

// Indexes
productSchema.index({ category: 1 });
productSchema.index({ collectionRef: 1 });
productSchema.index({ salePrice: 1 });
productSchema.index({ price: 1 });
productSchema.index({ gender: 1 });
productSchema.index({ movement: 1 });
productSchema.index({ isDeleted: 1 });
productSchema.index({ name: 'text', description: 'text', sku: 'text' });

module.exports = mongoose.model('Product', productSchema);
// ProductDetail.tsx

import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { UserRoleName } from "../../auth/constants/userRoles";
import CustomerLayout from "../components/CustomerLayout";
import ColorSelector, { ColorOption } from "./ColorSelector";
import OutOfStockBanner from "./OutOfStockBanner";
import PriceDisplay from "./PriceDisplay";
import ShareButton from "./ShareButton";
import SizeSelector, { SizeOption } from "./SizeSelector";
import TrustBadges from "./TrustBadges";

interface ProductDetailData {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  colors: ColorOption[];
  sizes: SizeOption[];
  images: string[];
  inStock: boolean;
}

const dummyProduct: ProductDetailData = {
  id: "prod-1",
  name: "Test Product Lorem Ipsum Dolor Sit Amet, Consectetuer Adipiscing Elit. Aenean Commodo Psum Dolor Sit Amet, Consectetuer Adipiscing Elit.",
  description: "test",
  price: 10000,
  originalPrice: 20000,
  colors: [
    { id: "green", name: "Green", hex: "#059669" },
    { id: "red", name: "Red", hex: "#b91c1c" },
  ],
  sizes: [
    { value: "10", available: false },
    { value: "20", available: true },
    { value: "30", available: true },
  ],
  images: [
    "https://via.placeholder.com/500x500?text=Main+Image",
    "https://via.placeholder.com/80x80?text=Thumb1",
    "https://via.placeholder.com/80x80?text=Thumb2",
  ],
  inStock: true,
};

const ProductDetail: React.FC<{ product?: ProductDetailData }> = ({
  product = dummyProduct,
}) => {
  // const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.colors[0]?.id || null
  );
  const [selectedSize, setSelectedSize] = useState<string | number | null>(
    product.sizes[0]?.value || null
  );
  const [mainImage, setMainImage] = useState<string>(product.images[0]);

  // Determine size state (even unavailable one can be selected)
  const selectedSizeObj = product.sizes.find(
    (s) => String(s.value) === String(selectedSize)
  );
  const isSizeUnavailable = selectedSizeObj
    ? !selectedSizeObj.available
    : false;

  // Out of stock if overall out or selected size is unavailable
  const isOutOfStock = !product.inStock || isSizeUnavailable;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    alert("Added to cart");
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    alert("Proceed to buy");
  };

  return (
    <CustomerLayout role={UserRoleName.CUSTOMER}>
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Image gallery */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4 relative">
            <div className="relative">
              <div className="rounded-md border bg-white overflow-hidden">
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-auto object-contain"
                  loading="lazy"
                />
              </div>
              <ShareButton onClick={() => alert("Share clicked")} />
            </div>
            <div className="flex gap-3 mt-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(img)}
                  className={`w-16 h-16 rounded border flex items-center justify-center overflow-hidden transition ${
                    mainImage === img
                      ? "ring-2 ring-blue-600"
                      : "border-gray-200"
                  }`}
                  aria-label={`Thumbnail ${i + 1}`}
                >
                  <img
                    src={img}
                    alt={`thumb-${i}`}
                    className="object-contain w-full h-full"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col">
            <h1 className="text-2xl font-semibold mb-2 leading-tight">
              {product.name}
            </h1>

            <div className="mb-4">
              <PriceDisplay
                price={product.price}
                originalPrice={product.originalPrice}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-10">
              <div className="flex-1">
                <ColorSelector
                  colors={product.colors}
                  selectedId={selectedColor}
                  onSelect={(id) => setSelectedColor(id)}
                />
                <SizeSelector
                  sizes={product.sizes}
                  selected={selectedSize}
                  onSelect={(s) => setSelectedSize(s)}
                />
              </div>
            </div>

            {isOutOfStock && <OutOfStockBanner />}

            <div className="flex flex-col sm:flex-row gap-4 mt-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`
                  flex-1 px-6 py-3 rounded border text-base font-medium transition
                  ${
                    isOutOfStock
                      ? "bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed"
                      : "border-blue-600 text-blue-600 bg-white hover:bg-blue-50"
                  }
                `}
              >
                Add to cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className={`
                  flex-1 px-6 py-3 rounded text-base font-medium transition text-white
                  ${
                    isOutOfStock
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }
                `}
              >
                Buy now
              </button>
            </div>

            <TrustBadges />

            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Product details</h2>
              <p className="text-sm text-gray-700">{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default ProductDetail;

import { useParams, Link } from "react-router-dom";
import {
    ShoppingCart,
    Zap,
    ChevronRight,
    Package,
    ShieldCheck,
    Truck,
    ArrowLeft,
    Minus,
    Plus,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { ProductImageGallery } from "../features/product/components/ProductImageGallery";
import type { Product, ProductImage } from "../api/client";

// ── Mock data (sẽ thay bằng API thật sau) ──────────────────────────
type MockProduct = Product & {
    categoryName: string;
    brandName: string;
    categorySlug: string;
    brandSlug: string;
    slug: string;
    mockImages: ProductImage[];
    specs: { label: string; value: string }[];
};

const mockProductsMap: Record<string, MockProduct> = {
    "galaxy-s24-ultra-256gb": {
        id: 1,
        name: "Samsung Galaxy S24 Ultra 256GB",
        description:
            "Flagship smartphone cao cấp nhất của Samsung với chip Snapdragon 8 Gen 3, camera 200MP AI, bút S-Pen tích hợp, màn hình Dynamic AMOLED 2X 6.8 inch QHD+, pin 5000mAh sạc nhanh 45W. Thiết kế titan bền bỉ, chống nước IP68.",
        price: 28990000,
        stockQuantity: 0,
        categoryId: 1,
        brandId: 1,
        categoryName: "Điện thoại",
        brandName: "Samsung",
        categorySlug: "dien-thoai",
        brandSlug: "samsung",
        slug: "galaxy-s24-ultra-256gb",
        specs: [
            { label: "Màn hình", value: '6.8" Dynamic AMOLED 2X, QHD+' },
            { label: "Chip", value: "Snapdragon 8 Gen 3 for Galaxy" },
            { label: "RAM", value: "12 GB" },
            { label: "Bộ nhớ", value: "256 GB" },
            { label: "Camera sau", value: "200MP + 50MP + 12MP + 10MP" },
            { label: "Pin", value: "5000 mAh, sạc 45W" },
            { label: "Hệ điều hành", value: "Android 14, One UI 6.1" },
        ],
        mockImages: [
            { id: 1, imageUrl: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/s/s/ss-s24-ultra-xam-1.png", isPrimary: true, productId: 1 },
            { id: 2, imageUrl: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/s/s/ss-s24-ultra-xam-2.png", isPrimary: false, productId: 1 },
            { id: 3, imageUrl: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/s/s/ss-s24-ultra-xam-3.png", isPrimary: false, productId: 1 },
            { id: 4, imageUrl: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/s/s/ss-s24-ultra-xam-4.png", isPrimary: false, productId: 1 },
        ],
    },
    "macbook-air-m3-13-inch": {
        id: 2,
        name: "MacBook Air M3 13 inch",
        description:
            "Laptop mỏng nhẹ hiệu năng cao với chip Apple M3, màn hình Liquid Retina 13.6 inch, 8GB RAM, 256GB SSD. Thiết kế unibody nhôm, pin lên tới 18 giờ, hỗ trợ MagSafe 3 sạc nhanh.",
        price: 27490000,
        stockQuantity: 8,
        categoryId: 2,
        brandId: 2,
        categoryName: "Laptop",
        brandName: "Apple",
        categorySlug: "laptop",
        brandSlug: "apple",
        slug: "macbook-air-m3-13-inch",
        specs: [
            { label: "Màn hình", value: '13.6" Liquid Retina, 2560×1664' },
            { label: "Chip", value: "Apple M3 (8-core CPU, 10-core GPU)" },
            { label: "RAM", value: "8 GB" },
            { label: "Bộ nhớ", value: "256 GB SSD" },
            { label: "Pin", value: "Lên tới 18 giờ" },
            { label: "Cân nặng", value: "1.24 kg" },
            { label: "Hệ điều hành", value: "macOS Sonoma" },
        ],
        mockImages: [
            { id: 5, imageUrl: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/m/a/macbook-air-m3-13-midnight-1_3.png", isPrimary: true, productId: 2 },
            { id: 6, imageUrl: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/m/a/macbook-air-m3-13-midnight-2_3.png", isPrimary: false, productId: 2 },
            { id: 7, imageUrl: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/m/a/macbook-air-m3-13-midnight-3_3.png", isPrimary: false, productId: 2 },
        ],
    },
    "huawei-watch-gt-5-pro": {
        id: 3,
        name: "Huawei Watch GT 5 Pro",
        description:
            "Đồng hồ thông minh cao cấp với vỏ titan, mặt sapphire, theo dõi sức khoẻ toàn diện SpO2, nhịp tim, GPS tích hợp. Pin lên tới 14 ngày, chống nước 5ATM, hỗ trợ hơn 100 chế độ luyện tập.",
        price: 9490000,
        stockQuantity: 20,
        categoryId: 3,
        brandId: 3,
        categoryName: "Đồng hồ",
        brandName: "Huawei",
        categorySlug: "dong-ho",
        brandSlug: "huawei",
        slug: "huawei-watch-gt-5-pro",
        specs: [
            { label: "Màn hình", value: '1.43" AMOLED, 466×466' },
            { label: "Chất liệu", value: "Vỏ titan, mặt sapphire" },
            { label: "Pin", value: "Lên tới 14 ngày" },
            { label: "Chống nước", value: "5 ATM" },
            { label: "Cảm biến", value: "SpO2, nhịp tim, GPS" },
            { label: "Kết nối", value: "Bluetooth 5.2" },
        ],
        mockImages: [
            { id: 8, imageUrl: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/d/o/dong-ho-huawei-watch-gt5-pro_1_.png", isPrimary: true, productId: 3 },
            { id: 9, imageUrl: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/d/o/dong-ho-huawei-watch-gt5-pro_2_.png", isPrimary: false, productId: 3 },
        ],
    },
    "oppo-find-x7-ultra": {
        id: 4,
        name: "Oppo Find X7 Ultra",
        description:
            "Camera Hasselblad kép với cảm biến 1 inch, chip Snapdragon 8 Gen 3, màn hình AMOLED 6.82 inch 2K 120Hz, pin 5000mAh sạc nhanh 100W SUPERVOOC. Chống nước IP68.",
        price: 22990000,
        stockQuantity: 12,
        categoryId: 1,
        brandId: 4,
        categoryName: "Điện thoại",
        brandName: "Oppo",
        categorySlug: "dien-thoai",
        brandSlug: "oppo",
        slug: "oppo-find-x7-ultra",
        specs: [
            { label: "Màn hình", value: '6.82" AMOLED 2K, 120Hz' },
            { label: "Chip", value: "Snapdragon 8 Gen 3" },
            { label: "RAM", value: "16 GB" },
            { label: "Bộ nhớ", value: "256 GB" },
            { label: "Camera sau", value: "50MP + 50MP + 64MP + 50MP" },
            { label: "Pin", value: "5000 mAh, sạc 100W" },
        ],
        mockImages: [
            { id: 10, imageUrl: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/o/p/oppo-find-x7-ultra.png", isPrimary: true, productId: 4 },
            { id: 11, imageUrl: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/o/p/oppo-find-x7-ultra-2.png", isPrimary: false, productId: 4 },
            { id: 12, imageUrl: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/o/p/oppo-find-x7-ultra-3.png", isPrimary: false, productId: 4 },
        ],
    },
    "xiaomi-14-ultra-5g": {
        id: 5,
        name: "Xiaomi 14 Ultra 5G",
        description:
            "Camera Leica Summilux chuyên nghiệp, chip Snapdragon 8 Gen 3, màn hình 2K AMOLED LTPO 120Hz, pin 5000mAh sạc 90W có dây + 50W không dây. Kính Gorilla Glass Victus 2.",
        price: 19990000,
        stockQuantity: 10,
        categoryId: 1,
        brandId: 5,
        categoryName: "Điện thoại",
        brandName: "Xiaomi",
        categorySlug: "dien-thoai",
        brandSlug: "xiaomi",
        slug: "xiaomi-14-ultra-5g",
        specs: [
            { label: "Màn hình", value: '6.73" AMOLED 2K, LTPO 120Hz' },
            { label: "Chip", value: "Snapdragon 8 Gen 3" },
            { label: "RAM", value: "16 GB" },
            { label: "Bộ nhớ", value: "512 GB" },
            { label: "Camera sau", value: "50MP Leica × 3" },
            { label: "Pin", value: "5000 mAh, sạc 90W" },
        ],
        mockImages: [
            { id: 13, imageUrl: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-14-ultra-den.png", isPrimary: true, productId: 5 },
            { id: 14, imageUrl: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-14-ultra-den-2.png", isPrimary: false, productId: 5 },
        ],
    },
    "airpods-pro-2-usb-c": {
        id: 6,
        name: "AirPods Pro 2 USB-C",
        description:
            "Tai nghe chống ồn chủ động Apple thế hệ 2 với cổng USB-C, chip H2, Adaptive Audio, âm thanh không gian cá nhân hoá, chống nước IPX4, pin 6 giờ (30 giờ với hộp sạc).",
        price: 5690000,
        stockQuantity: 30,
        categoryId: 4,
        brandId: 2,
        categoryName: "Tai nghe",
        brandName: "Apple",
        categorySlug: "tai-nghe",
        brandSlug: "apple",
        slug: "airpods-pro-2-usb-c",
        specs: [
            { label: "Chip", value: "Apple H2" },
            { label: "Chống ồn", value: "Active Noise Cancellation" },
            { label: "Chống nước", value: "IPX4" },
            { label: "Pin tai nghe", value: "Lên tới 6 giờ" },
            { label: "Pin hộp sạc", value: "Lên tới 30 giờ" },
            { label: "Kết nối", value: "Bluetooth 5.3, USB-C" },
        ],
        mockImages: [
            { id: 15, imageUrl: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/a/i/airpods-pro-2-usb-c_1__1.png", isPrimary: true, productId: 6 },
            { id: 16, imageUrl: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/a/i/airpods-pro-2-usb-c_2.png", isPrimary: false, productId: 6 },
            { id: 17, imageUrl: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/a/i/airpods-pro-2-usb-c_3.png", isPrimary: false, productId: 6 },
        ],
    },
};

function formatCurrency(n: number) {
    return n.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

export default function ProductDetailsPage() {
    const { productSlug } = useParams<{ categorySlug: string; brandSlug: string; productSlug: string }>();
    const product = mockProductsMap[productSlug ?? ""];
    const [quantity, setQuantity] = useState(1);

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <Package className="h-16 w-16 text-slate-300 mb-4" />
                <h2 className="text-xl font-semibold text-slate-700 mb-2">
                    Không tìm thấy sản phẩm
                </h2>
                <p className="text-sm text-slate-500 mb-6">
                    Sản phẩm bạn đang tìm không tồn tại hoặc đã bị xoá.
                </p>
                <Link to="/">
                    <Button variant="primary">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Về trang chủ
                    </Button>
                </Link>
            </div>
        );
    }

    // Sort images: primary first
    const sortedImages = [...product.mockImages].sort(
        (a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0)
    );

    const inStock = (product.stockQuantity ?? 0) > 0;

    return (
        <div className="pb-10">
            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center gap-1 text-sm text-slate-500">
                <Link to="/" className="hover:text-brand-brown transition-colors">
                    Trang chủ
                </Link>
                <ChevronRight className="h-3.5 w-3.5" />
                <Link
                    to={`/${product.categorySlug}`}
                    className="hover:text-brand-brown transition-colors"
                >
                    {product.categoryName}
                </Link>
                <ChevronRight className="h-3.5 w-3.5" />
                <Link
                    to={`/${product.categorySlug}/${product.brandSlug}`}
                    className="hover:text-brand-brown transition-colors"
                >
                    {product.brandName}
                </Link>
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="text-slate-900 font-medium truncate max-w-[200px]">
                    {product.name}
                </span>
            </nav>

            {/* ── Product main section ────────────────────────── */}
            <div className="grid gap-8 lg:grid-cols-2">
                {/* Left: Image gallery */}
                <ProductImageGallery images={sortedImages} />

                {/* Right: Product info */}
                <div className="flex flex-col">
                    {/* Badges */}
                    <div className="mb-3 flex items-center gap-2">
                        <Badge variant="brand">{product.brandName}</Badge>
                        <Badge variant="category">{product.categoryName}</Badge>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-slate-900 leading-tight mb-2">
                        {product.name}
                    </h1>

                    {/* Price */}
                    <div className="mb-6 rounded-xl bg-brand-orange/5 border border-brand-orange/20 px-5 py-4">
                        <span className="text-3xl font-bold text-brand-brown">
                            {formatCurrency(product.price ?? 0)}
                        </span>
                    </div>

                    {/* Stock status */}
                    <div className="mb-6 flex items-center gap-2">
                        <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${inStock
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : "bg-red-50 text-red-600 border border-red-200"
                                }`}
                        >
                            <span
                                className={`h-1.5 w-1.5 rounded-full ${inStock ? "bg-green-500" : "bg-red-500"
                                    }`}
                            />
                            {inStock
                                ? `Còn hàng (${product.stockQuantity})`
                                : "Hết hàng"}
                        </span>
                    </div>

                    {/* Description */}
                    <p className="mb-6 text-sm leading-relaxed text-slate-600">
                        {product.description}
                    </p>

                    {/* Quantity */}
                    <div className="mb-6">
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Số lượng
                        </label>
                        <div className="inline-flex items-center rounded-lg border border-slate-300">
                            <button
                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                className="flex h-10 w-10 items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors rounded-l-lg"
                                disabled={quantity <= 1}
                            >
                                <Minus className="h-4 w-4" />
                            </button>
                            <span className="flex h-10 w-12 items-center justify-center border-x border-slate-300 text-sm font-medium">
                                {quantity}
                            </span>
                            <button
                                onClick={() =>
                                    setQuantity((q) =>
                                        Math.min(product.stockQuantity ?? 1, q + 1)
                                    )
                                }
                                className="flex h-10 w-10 items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors rounded-r-lg"
                                disabled={quantity >= (product.stockQuantity ?? 1)}
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Button
                            size="lg"
                            variant="primary"
                            className="flex-1 gap-2 rounded-xl py-3 text-base"
                            disabled={!inStock}
                        >
                            <ShoppingCart className="h-5 w-5" />
                            Thêm vào giỏ hàng
                        </Button>
                        <button
                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-brown px-5 py-3 text-base font-semibold text-white hover:bg-brand-brown/90 focus:outline-none focus:ring-2 focus:ring-brand-brown/50 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                            disabled={!inStock}
                        >
                            <Zap className="h-5 w-5" />
                            Mua ngay
                        </button>
                    </div>

                    {/* Trust badges */}
                    <div className="mt-6 grid grid-cols-3 gap-3">
                        {[
                            { icon: Truck, text: "Giao hàng miễn phí" },
                            { icon: ShieldCheck, text: "Bảo hành chính hãng" },
                            { icon: Package, text: "Đổi trả 30 ngày" },
                        ].map(({ icon: Icon, text }) => (
                            <div
                                key={text}
                                className="flex flex-col items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-3 text-center"
                            >
                                <Icon className="h-5 w-5 text-brand-orange" />
                                <span className="text-[11px] font-medium text-slate-600 leading-tight">
                                    {text}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Specs table ─────────────────────────────────── */}
            <section className="mt-10">
                <h2 className="mb-4 text-lg font-bold text-slate-900">
                    Thông số kỹ thuật
                </h2>
                <div className="overflow-hidden rounded-xl border border-slate-200">
                    <table className="w-full text-sm">
                        <tbody>
                            {product.specs.map((spec, i) => (
                                <tr
                                    key={spec.label}
                                    className={i % 2 === 0 ? "bg-slate-50" : "bg-white"}
                                >
                                    <td className="w-1/3 px-4 py-3 font-medium text-slate-600">
                                        {spec.label}
                                    </td>
                                    <td className="px-4 py-3 text-slate-900">
                                        {spec.value}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

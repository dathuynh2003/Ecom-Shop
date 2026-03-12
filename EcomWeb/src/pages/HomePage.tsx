import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import type { Product } from "../api/client";

const mockProducts: (Product & { categoryName: string; brandName: string; primaryImage: string })[] = [
    {
        id: 1,
        name: "Samsung Galaxy S24 Ultra 256GB",
        description: "Flagship smartphone với camera 200MP",
        price: 28990000,
        stockQuantity: 15,
        categoryId: 1,
        brandId: 1,
        categoryName: "Điện thoại",
        brandName: "Samsung",
        primaryImage:
            "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/s/s/ss-s24-ultra-xam-1.png",
    },
    {
        id: 2,
        name: "MacBook Air M3 13 inch",
        description: "Laptop mỏng nhẹ hiệu năng cao",
        price: 27490000,
        stockQuantity: 8,
        categoryId: 2,
        brandId: 2,
        categoryName: "Laptop",
        brandName: "Apple",
        primaryImage:
            "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/m/a/macbook-air-m3-13-midnight-1_3.png",
    },
    {
        id: 3,
        name: "Huawei Watch GT 5 Pro",
        description: "Đồng hồ thông minh thiết kế sang trọng",
        price: 9490000,
        stockQuantity: 20,
        categoryId: 3,
        brandId: 3,
        categoryName: "Đồng hồ",
        brandName: "Huawei",
        primaryImage:
            "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/d/o/dong-ho-huawei-watch-gt5-pro_1_.png",
    },
    {
        id: 4,
        name: "Oppo Find X7 Ultra",
        description: "Camera Hasselblad kép, Snapdragon 8 Gen 3",
        price: 22990000,
        stockQuantity: 12,
        categoryId: 1,
        brandId: 4,
        categoryName: "Điện thoại",
        brandName: "Oppo",
        primaryImage:
            "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/o/p/oppo-find-x7-ultra.png",
    },
    {
        id: 5,
        name: "Xiaomi 14 Ultra 5G",
        description: "Camera Leica, màn hình 2K AMOLED",
        price: 19990000,
        stockQuantity: 10,
        categoryId: 1,
        brandId: 5,
        categoryName: "Điện thoại",
        brandName: "Xiaomi",
        primaryImage:
            "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-14-ultra-den.png",
    },
    {
        id: 6,
        name: "AirPods Pro 2 USB-C",
        description: "Tai nghe chống ồn chủ động Apple",
        price: 5690000,
        stockQuantity: 30,
        categoryId: 4,
        brandId: 2,
        categoryName: "Tai nghe",
        brandName: "Apple",
        primaryImage:
            "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/a/i/airpods-pro-2-usb-c_1__1.png",
    },
];

function formatCurrency(n: number) {
    return n.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
    });
}

export default function HomePage() {
    return (
        <div>
            <section className="mb-6">
                <h1 className="mb-1 text-2xl font-bold text-slate-900">
                    Sản phẩm nổi bật
                </h1>
                <p className="text-sm text-slate-500">
                    Khám phá những sản phẩm công nghệ mới nhất được yêu thích nhất.
                </p>
            </section>

            <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                {mockProducts.map((p) => (
                    <article
                        key={p.id}
                        className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="aspect-square overflow-hidden bg-slate-50 p-4">
                            <img
                                src={p.primaryImage}
                                alt={p.name ?? ""}
                                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>
                        <div className="flex flex-1 flex-col gap-2 p-4">
                            <div className="flex items-center gap-2">
                                <Badge variant="brand">{p.brandName}</Badge>
                                <Badge variant="category">{p.categoryName}</Badge>
                            </div>
                            <h2 className="line-clamp-2 text-sm font-medium text-slate-900">
                                {p.name}
                            </h2>
                            <p className="line-clamp-1 text-xs text-slate-500">
                                {p.description}
                            </p>
                            <div className="mt-auto flex items-center justify-between pt-2">
                                <span className="text-base font-bold text-brand-brown">
                                    {formatCurrency(p.price ?? 0)}
                                </span>
                                <Button size="sm" variant="primary">
                                    Thêm vào giỏ
                                </Button>
                            </div>
                        </div>
                    </article>
                ))}
            </section>
        </div>
    );
}

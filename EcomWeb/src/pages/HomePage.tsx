import { MainLayout } from "../components/layout/MainLayout";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

const mockProducts = [
    {
        id: "1",
        name: "Tai nghe Bluetooth X1",
        brand: "SoundX",
        category: "Âm thanh",
        price: 1290000,
        image:
            "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:0/q:90/plain/https://cellphones.com.vn/media/wysiwyg/Tai-nghe/Edifier/tai-nghe-bluetooth-edifier-x1-air-3.jpg",
    },
    {
        id: "2",
        name: "Chuột gaming Pro",
        brand: "GamerZ",
        category: "Gaming",
        price: 890000,
        image:
            "https://product.hstatic.net/200000722513/product/thumbchuot-recovered_757cce0149c042149f8b58f30fcb3307_8868cbe7339a46e9813f2eb8bdb334ee.png",
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
        <MainLayout>
            <section className="mb-6">
                <h1 className="mb-2 text-2xl font-semibold text-slate-900">
                    Sản phẩm nổi bật
                </h1>
                <p className="text-sm text-slate-900">
                    Khách vãng lai và khách hàng đều có thể xem danh sách sản phẩm.
                </p>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {mockProducts.map((p) => (
                    <article
                        key={p.id}
                        className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                    >
                        <div className="aspect-[4/3] bg-slate-100">
                            <img
                                src={p.image}
                                alt={p.name}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="flex flex-1 flex-col gap-2 p-3">
                            <div className="flex items-center justify-between gap-2">
                                <Badge variant="brand">{p.brand}</Badge>
                                <Badge variant="category">{p.category}</Badge>
                            </div>
                            <h2 className="line-clamp-2 text-sm font-medium text-slate-900">
                                {p.name}
                            </h2>
                            <div className="mt-auto flex items-center justify-between">
                                <span className="text-base font-semibold text-brand-brown">
                                    {formatCurrency(p.price)}
                                </span>
                                <Button size="sm" variant="primary">
                                    Thêm vào giỏ
                                </Button>
                            </div>
                        </div>
                    </article>
                ))}
            </section>
        </MainLayout>
    );
}
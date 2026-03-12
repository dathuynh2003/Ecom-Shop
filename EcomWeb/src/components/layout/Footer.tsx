export function Footer() {
    return (
        <footer className="border-t border-slate-200 bg-white">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-slate-400 md:flex-row">
                <span>
                    © {new Date().getFullYear()}{" "}
                    <span className="text-brand-orange">E-</span>
                    <span className="text-slate-600">Shop</span>. Bảo lưu mọi quyền.
                </span>
                <div className="flex gap-4">
                    <a href="#" className="hover:text-brand-orange transition-colors">
                        Điều khoản
                    </a>
                    <a href="#" className="hover:text-brand-orange transition-colors">
                        Chính sách bảo mật
                    </a>
                </div>
            </div>
        </footer>
    );
}

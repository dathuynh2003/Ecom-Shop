export function Footer() {
    return (
        <footer className="border-t border-slate-800 bg-black/80">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-slate-400 md:flex-row">
                <span>
                    © {new Date().getFullYear()}{" "}
                    <span className="text-brand-orange">E-</span>
                    <span className="text-slate-300">Shop</span>. All rights reserved.
                </span>
                <div className="flex gap-4">
                    <a href="#" className="hover:text-brand-orange">
                        Điều khoản
                    </a>
                    <a href="#" className="hover:text-brand-orange">
                        Chính sách bảo mật
                    </a>
                </div>
            </div>
        </footer>
    );
}

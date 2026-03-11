import { type ReactNode } from "react";
import { Header } from "./Header";
// import { Footer } from "./Footer";
import { Sidebar } from "./Sidebar";

interface MainLayoutProps {
    children: ReactNode;
    withSidebar?: boolean;
}

export function MainLayout({ children, withSidebar }: MainLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col bg-white text-slate-50">
            <Header />
            <div className="mx-auto flex w-full max-w-6xl flex-1 px-4 py-4 gap-4">
                {withSidebar && <Sidebar />}
                <main className="flex-1">{children}</main>
            </div>
            {/* <Footer /> */}
        </div>
    );
}

import { type ReactNode, useState, useCallback } from "react";
import { Header } from "./Header";
// import { Footer } from "./Footer";
import { Sidebar } from "./Sidebar";

interface MainLayoutProps {
    children: ReactNode;
    withSidebar?: boolean;
}

export function MainLayout({ children, withSidebar }: MainLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);
    const closeSidebar = useCallback(() => setSidebarOpen(false), []);

    return (
        <div className="flex min-h-screen flex-col bg-bg-canvas text-slate-900">
            <Header onToggleSidebar={withSidebar ? toggleSidebar : undefined} />

            <div className="mx-auto flex w-full max-w-7xl flex-1 gap-4 px-4 py-5">
                {withSidebar && (
                    <Sidebar open={sidebarOpen} onClose={closeSidebar} />
                )}
                <main className="min-w-0 flex-1">{children}</main>
            </div>

            {/* <Footer /> */}
        </div>
    );
}

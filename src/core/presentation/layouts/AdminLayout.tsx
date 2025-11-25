import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/core/presentation/components/ui/sidebar";
import { AppSidebar } from "@/core/presentation/components/AppSidebar";
import { useState, useEffect } from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface PageMetadata {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [metadata, setMetadata] = useState<PageMetadata>({});

  useEffect(() => {
    const handleMetadata = (event: CustomEvent) => {
      setMetadata(event.detail);
    };

    window.addEventListener('page-metadata' as any, handleMetadata);
    return () => window.removeEventListener('page-metadata' as any, handleMetadata);
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <div className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6">
            <SidebarTrigger />
            {metadata.title && (
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="flex items-center gap-2">
                  {metadata.icon && <span className="text-gray-700">{metadata.icon}</span>}
                  <h1 className="text-xl font-bold">{metadata.title}</h1>
                </div>
                {metadata.subtitle && (
                  <p className="text-xs text-muted-foreground">{metadata.subtitle}</p>
                )}
              </div>
            )}
            {!metadata.title && <div className="flex-1" />}
          </div>
          <main className="p-4 md:p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

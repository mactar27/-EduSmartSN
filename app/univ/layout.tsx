import { ReactNode } from "react";
import { UnivSidebar } from "@/components/univ/sidebar";
import { UnivHeader } from "@/components/univ/header";
import { DynamicThemeProvider } from "@/components/univ/theme-provider";

export default function UnivLayout({ children }: { children: ReactNode }) {
  return (
    <DynamicThemeProvider>
      <div className="flex h-screen bg-background text-foreground overflow-hidden">
        <UnivSidebar />
        <div className="flex-1 flex flex-col relative overflow-y-auto">
          <UnivHeader />
          <main className="p-6 md:p-8 space-y-8">
            {children}
          </main>
        </div>
      </div>
    </DynamicThemeProvider>
  );
}

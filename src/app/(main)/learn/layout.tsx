import { SiteSidebar } from "@/components/layout/site-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <SiteSidebar />
      <SidebarInset>
        <div className="mx-auto w-full max-w-4xl px-4 py-8 md:px-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

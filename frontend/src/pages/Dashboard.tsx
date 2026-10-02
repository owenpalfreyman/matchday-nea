import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const Dashboard = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
        </header>
        <main className="flex flex-1 items-center justify-center p-6 text-foreground">
          <h1 className="text-3xl font-bold tracking-tight">67</h1>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Dashboard

import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/components/AuthProvider";
import { Sidebar } from "lucide-react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Toaster } from "@/components/ui/sonner"

export const metadata = {
  title: "Следене на пари",
  description: "Следи къде отиват твоите пари",
};

export default function RootLayout({ children }) {
    
  return (
    // <SidebarProvider>
    //     <AppSidebar />
    //           <Separator
    //             orientation="vertical"
    //             className="mr-2 data-[orientation=vertical]:h-4"
    //           />
    //     {/* <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
    //         <div className="flex items-center gap-2 px-4">
    //           <SidebarTrigger className="-ml-1" />
    //           <Separator
    //             orientation="vertical"
    //             className="mr-2 data-[orientation=vertical]:h-4"
    //           />
    //           <Breadcrumb>
    //             <BreadcrumbList>
    //               <BreadcrumbItem className="hidden md:block">
    //                 <BreadcrumbLink href="#">
    //                   Building Your Application
    //                 </BreadcrumbLink>
    //               </BreadcrumbItem>
    //               <BreadcrumbSeparator className="hidden md:block" />
    //               <BreadcrumbItem>
    //                 <BreadcrumbPage>Data Fetching</BreadcrumbPage>
    //               </BreadcrumbItem>
    //             </BreadcrumbList>
    //           </Breadcrumb>
    //         </div>
    //       </header> */}
    //     {children}

    // </SidebarProvider>
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                      Building Your Application
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

        <div className="p-4">
        {children}
        </div>

        </SidebarInset>
      </SidebarProvider>
      <Toaster />
    </>
);
}

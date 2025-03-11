"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuthContext } from "@/components/AuthProvider"; // Import the auth context

export function AppSidebar({ ...props }) {
  const { user } = useAuthContext(); // Get the authenticated user from the context

  // Sidebar data
  const data = {
    user: {
      name: user?.name || "Guest",
      email: user?.email || "guest@example.com",
      avatar: user?.avatar || "/avatars/default.jpg",
    },
    teams: [
      {
        name: "CashFlow",
        logo: GalleryVerticalEnd,
      },
    ],
    navMain: [
      {
        title:"Начало",
        url: "/dashboard/"
      },
      {
        title: "Категории",
        url: "/dashboard/category",
        icon: SquareTerminal,
        isActive: true,
        items: [
          {
            title: "Виж",
            url: "/dashboard/category",
          },
          {
            title: "Създай",
            url: "/dashboard/category/create", // Updated URL
          },
          {
            title: "Settings",
            url: "#",
          },
        ],
      },
      {
        title: "Разходи",
        url: "#",
        icon: Bot,
        items: [
          {
            title: "Виж",
            url: "/dashboard/expenses/",
          },
          {
            title: "Добави",
            url: "/expenses/create",
          },
          {
            title: "Quantum",
            url: "#",
          },
        ],
      },
      {
        title: "Documentation",
        url: "#",
        icon: BookOpen,
        items: [
          {
            title: "Introduction",
            url: "#",
          },
          {
            title: "Get Started",
            url: "#",
          },
          {
            title: "Tutorials",
            url: "#",
          },
          {
            title: "Changelog",
            url: "#",
          },
        ],
      },
      {
        title: "Settings",
        url: "#",
        icon: Settings2,
        items: [
          {
            title: "General",
            url: "#",
          },
          {
            title: "Team",
            url: "#",
          },
          {
            title: "Billing",
            url: "#",
          },
          {
            title: "Limits",
            url: "#",
          },
        ],
      },
    ],
    // projects: [
    //   {
    //     name: "Design Engineering",
    //     url: "#",
    //     icon: Frame,
    //   },
    //   {
    //     name: "Sales & Marketing",
    //     url: "#",
    //     icon: PieChart,
    //   },
    //   {
    //     name: "Travel",
    //     url: "#",
    //     icon: Map,
    //   },
    // ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

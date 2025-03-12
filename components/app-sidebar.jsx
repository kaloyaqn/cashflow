"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  CircleDollarSignIcon,
  Frame,
  GalleryVerticalEnd,
  Home,
  Map,
  PieChart,
  Settings2,
  SquareStackIcon,
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

export function AppSidebar({ ...props }) {

  // Sidebar data
  const data = {
    user: {
      name:"Guest",
      email:  "guest@example.com",
      avatar: "/avatars/default.jpg",
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
        url: "/dashboard/",
        isLink: true, // Add this property to indicate it's just a link
        icon: Home,

      },
      {
        title: "Разходи",
        url: "#",
        icon: CircleDollarSignIcon,
        items: [
          {
            title: "Виж",
            url: "/dashboard/expenses/",
          },
          {
            title: "Добави",
            url: "/dashboard/expenses/create",
          },
        ],
      },
      {
        title: "Категории",
        url: "/dashboard/category",
        icon: SquareStackIcon,
        // isActive: true,
        items: [
          {
            title: "Виж",
            url: "/dashboard/category",
          },
          {
            title: "Създай",
            url: "/dashboard/category/create", // Updated URL
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

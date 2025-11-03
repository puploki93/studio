'use client';
import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons';
import { Home, Disc, Library, User } from 'lucide-react';
import { Button } from '../ui/button';

const menuItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/mixer', label: 'Mixer', icon: Disc },
  { href: '/library', label: 'Library', icon: Library },
  { href: '/profile', label: 'Profile', icon: User },
];

export function AppSidebar() {
  const pathname = usePathname();
  
  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <Logo className="h-8 w-8 text-primary" />
          <span className="text-lg font-semibold">GL⚡️TCH</span>
        </div>
      </SidebarHeader>
      <SidebarMenu className="flex-1 p-2">
        {menuItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href} passHref>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={{ children: item.label }}
              >
                <a>
                  <item.icon />
                  <span>{item.label}</span>
                </a>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <SidebarFooter>
         <div className="flex flex-col gap-2 p-2">
            <Button variant="outline" size="sm">Help</Button>
            <p className="text-center text-xs text-muted-foreground">© 2024 DJ Glitch</p>
         </div>
      </SidebarFooter>
    </Sidebar>
  );
}

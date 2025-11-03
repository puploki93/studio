'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar';
import { AppHeader } from './app-header';
import { AppSidebar } from './app-sidebar';
import { PlayerControls } from '../player/player-controls';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Determine if the sidebar should be shown based on the route.
  // For this app, we'll show it everywhere except potentially on a future landing page.
  const showSidebar = true; 

  const [isSidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <SidebarProvider open={isSidebarOpen} onOpenChange={setSidebarOpen}>
      {showSidebar && <AppSidebar />}
      <SidebarInset className="flex flex-col !p-0">
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 w-full">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </SidebarInset>
      <PlayerControls />
    </SidebarProvider>
  );
}

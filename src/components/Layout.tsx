import type React from 'react';
import { Header } from './Header';
import { BottomNavigation } from './BottomNavigation';
import { useTheme } from '../context/ThemeContext';
import { useStatusBar } from './StatusBar';
import { NetworkAlert } from './NetworkAlert';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { theme } = useTheme();
  useStatusBar();
  return (
    <div
      className={`flex flex-col min-h-screen bg-background text-foreground ${theme}`}
    >
      <Header />
      <NetworkAlert />
      <main className="h-screen overflow-hidden">{children}</main>
      <BottomNavigation />
    </div>
  );
}

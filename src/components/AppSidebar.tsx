import {
  LayoutDashboard, Receipt, Target, HandCoins, Wallet, PiggyBank,
  BarChart3, Bell, Shield, Users, Tags, Megaphone, ArrowLeftRight, LogOut
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarFooter, useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const userItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Expenses', url: '/expenses', icon: Receipt },
  { title: 'Budgets', url: '/budgets', icon: Target },
  { title: 'Debts', url: '/debts', icon: HandCoins },
  { title: 'Wallets', url: '/wallets', icon: Wallet },
  { title: 'Savings Goals', url: '/savings', icon: PiggyBank },
  { title: 'Reports', url: '/reports', icon: BarChart3 },
  { title: 'Notifications', url: '/notifications', icon: Bell },
];

const adminItems = [
  { title: 'Admin Dashboard', url: '/admin', icon: Shield },
  { title: 'Manage Users', url: '/admin/users', icon: Users },
  { title: 'Categories', url: '/admin/categories', icon: Tags },
  { title: 'Announcements', url: '/admin/announcements', icon: Megaphone },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const { user, logout, switchRole } = useAuth();
  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {!collapsed && (
          <div className="px-4 py-5">
            <h1 className="text-lg font-bold font-display text-sidebar-primary-foreground">
              💰 BudgetTracker
            </h1>
            <p className="text-xs text-sidebar-foreground/60 mt-0.5">
              {user?.role === 'admin' ? 'Admin Panel' : 'Personal Finance'}
            </p>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} end activeClassName="bg-sidebar-accent text-sidebar-accent-foreground">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {user?.role === 'admin' && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/50">Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <NavLink to={item.url} end activeClassName="bg-sidebar-accent text-sidebar-accent-foreground">
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-3">
        {!collapsed && <Separator className="mb-3 bg-sidebar-border" />}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={switchRole} className="text-sidebar-foreground/70 hover:text-sidebar-foreground">
              <ArrowLeftRight className="h-4 w-4" />
              {!collapsed && <span className="text-xs">Switch to {user?.role === 'admin' ? 'User' : 'Admin'}</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logout} className="text-sidebar-foreground/70 hover:text-destructive">
              <LogOut className="h-4 w-4" />
              {!collapsed && <span className="text-xs">Logout</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

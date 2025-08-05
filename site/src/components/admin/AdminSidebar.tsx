'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import {
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  Users,
  Settings,
  BarChart3,
  UserPlus,
  Briefcase,
  Send
} from 'lucide-react';

const navigation = [
  { name: 'Дашборд', href: '/admin', icon: LayoutDashboard },
  { name: 'Новости', href: '/admin/news', icon: FileText },
  { name: 'Слайдер', href: '/admin/slider', icon: ImageIcon },
  { name: 'Вакансии', href: '/admin/vacancies', icon: Briefcase },
  { name: 'Рассылка', href: '/admin/newsletter', icon: Send },
  { name: 'Подписчики', href: '/admin/subscribers', icon: Users },
  { name: 'Аналитика', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Добавить админа', href: '/admin/users/create', icon: UserPlus },
  { name: 'Настройки', href: '/admin/settings', icon: Settings },
];

interface AdminSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function AdminSidebar({ sidebarOpen, setSidebarOpen }: AdminSidebarProps) {
  const pathname = usePathname();

  const SidebarContent = () => (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-background border-r px-6 pb-4">
      <div className="flex h-16 shrink-0 items-center">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="font-semibold text-foreground">ИПИИ Админ</span>
        </Link>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                let isActive = false;
                
                if (item.href === '/admin') {
                  isActive = pathname === '/admin';
                } else {
                  isActive = pathname.startsWith(item.href);
                }
                
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors'
                      )}
                    >
                      <item.icon
                        className={cn(
                          isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground',
                          'h-6 w-6 shrink-0'
                        )}
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0 lg:hidden">
          <VisuallyHidden>
            <SheetTitle>Навигация</SheetTitle>
          </VisuallyHidden>
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <SidebarContent />
      </div>
    </>
  );
}
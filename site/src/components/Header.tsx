'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { 
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { 
  Menu, 
  Sun, 
  Moon, 
  User,
  Home,
  Newspaper,
  Mail,
  Info
} from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  onNewsClick?: () => void;
  onContactsClick?: () => void;
}

export function Header({ onNewsClick, onContactsClick }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleContactsClick = () => {
    if (onContactsClick) {
      onContactsClick();
    } else {
      const footer = document.querySelector('footer');
      if (footer) {
        footer.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileMenuOpen(false);
  };

  const handleNewsClick = () => {
    if (onNewsClick) {
      onNewsClick();
    }
    setMobileMenuOpen(false);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const navigationItems = [
    { name: 'Главная', href: '/', icon: Home },
    { name: 'Новости', onClick: handleNewsClick, icon: Newspaper },
    { name: 'О нас', href: '/about', icon: Info },
    { name: 'Контакты', onClick: handleContactsClick, icon: Mail },
  ];

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        {/* Логотип */}
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-bold">И</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold leading-tight">ФГБНУ "ИПИИ"</span>
            <span className="text-xs text-muted-foreground hidden sm:block">
              Совет молодых ученых
            </span>
          </div>
        </Link>

        {/* Навигация для десктопа */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            href="/"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Главная
          </Link>
          <button 
            onClick={handleNewsClick}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Новости
          </button>
          <Link 
            href="/about"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            О нас
          </Link>
          <button 
            onClick={handleContactsClick}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Контакты
          </button>
        </nav>

        {/* Правая часть */}
        <div className="flex items-center space-x-2">
          {/* Переключатель темы */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="w-9 h-9 p-0"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Переключить тему</span>
          </Button>

          {/* Кнопки для десктопа */}
          <div className="hidden md:flex items-center space-x-2">
            <Link href="/admin/login">
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4 mr-2" />
                Войти
              </Button>
            </Link>
            <Button size="sm">
              Присоединиться
            </Button>
          </div>

          {/* Мобильное меню */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden w-9 h-9 p-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Открыть меню</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-6">
                {/* Навигация */}
                <div className="space-y-2">
                  {navigationItems.map((item) => (
                    <div key={item.name}>
                      {item.href ? (
                        <Link
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center space-x-3 px-3 py-2 rounded-md text-base hover:bg-muted transition-colors"
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.name}</span>
                        </Link>
                      ) : (
                        <button
                          onClick={item.onClick}
                          className="flex items-center space-x-3 px-3 py-2 rounded-md text-base hover:bg-muted transition-colors w-full text-left"
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.name}</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Разделитель */}
                <div className="border-t my-4"></div>

                {/* Кнопки действий */}
                <div className="space-y-2">
                  <Link href="/admin/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="h-4 w-4 mr-2" />
                      Войти
                    </Button>
                  </Link>
                  <Button className="w-full" onClick={() => setMobileMenuOpen(false)}>
                    Присоединиться
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
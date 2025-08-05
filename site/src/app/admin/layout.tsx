import { ReactNode } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Административная панель | ФГБНУ ИПИИ',
  description: 'Панель администратора для управления сайтом ФГБНУ ИПИИ',
};

export default function AdminRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
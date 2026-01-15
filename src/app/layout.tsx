import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import AuthLayout from './(full-width-pages)/(auth)/layout';
import { Toaster } from 'react-hot-toast';
import MainLayout from '@/layout/mainLayout';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
       
    
            
            <MainLayout>{children}</MainLayout>
           
        
        
        <Toaster toastOptions={{ duration: 3000 }} />
       
      </body>
    </html>
  );
}

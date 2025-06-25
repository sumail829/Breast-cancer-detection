'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ModeToggle } from '@/components/theme-toggle';

export function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-200',
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-blue-600">Hospital Pro</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href="#features"
              className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
            >
              Features
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
            >
              Login
            </Link>
            <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/register">
                Register
              </Link>
            </Button>
            <ModeToggle />
          </nav>

          {/* Mobile Navigation Toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 py-4">
          <div className="container px-4 md:px-6 mx-auto">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-base font-medium text-slate-700 hover:text-blue-600 transition-colors px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="#features"
                className="text-base font-medium text-slate-700 hover:text-blue-600 transition-colors px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/login"
                className="text-base font-medium text-slate-700 hover:text-blue-600 transition-colors px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 text-white hover:bg-blue-700 transition-colors px-4 py-2 rounded-md text-base font-medium text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
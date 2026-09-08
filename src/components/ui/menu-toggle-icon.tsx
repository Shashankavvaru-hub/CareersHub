import React from 'react';
import { Menu, X } from 'lucide-react';

export function MenuToggleIcon({ open, className }: { open: boolean; className?: string; duration?: number }) {
  // We use lucide-react icons for the menu toggle. 
  // You can easily swap this for a complex animated SVG if desired.
  return open ? (
    <X className={className} />
  ) : (
    <Menu className={className} />
  );
}

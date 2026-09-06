import { LayoutDashboard, Users, Building2, Factory, FileText, Tag } from 'lucide-react';

export const adminNavItems = [
  { to: '/admin/dashboard', label: 'nav.overview', icon: LayoutDashboard },
  { to: '/admin/users', label: 'nav.users', icon: Users },
  { to: '/admin/universities', label: 'nav.universities', icon: Building2 },
  { to: '/admin/industries', label: 'nav.industries', icon: Factory },
  { to: '/admin/challenges', label: 'nav.challenges', icon: FileText },
  { to: '/admin/categories', label: 'nav.categories', icon: Tag },
];
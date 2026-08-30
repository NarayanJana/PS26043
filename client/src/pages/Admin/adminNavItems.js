import { LayoutDashboard, Users, Building2, Factory, FileText, Tag } from 'lucide-react';

export const adminNavItems = [
  { to: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/universities', label: 'Universities', icon: Building2 },
  { to: '/admin/industries', label: 'Industries', icon: Factory },
  { to: '/admin/challenges', label: 'Challenges', icon: FileText },
  { to: '/admin/categories', label: 'Categories', icon: Tag },
];
import { LayoutDashboard, FilePlus, Compass } from 'lucide-react';
import { adminNavItems } from '../pages/Admin/adminNavItems';

const CITIZEN_NAV = [
  { to: '/citizen/dashboard', label: 'nav.dashboard', icon: LayoutDashboard },
  { to: '/citizen/submit-challenge', label: 'nav.submitChallenge', icon: FilePlus },
  { to: '/challenges', label: 'nav.exploreChallenges', icon: Compass },
];

const UNIVERSITY_NAV = [{ to: '/university/dashboard', label: 'nav.dashboard', icon: LayoutDashboard }];

const INDUSTRY_NAV = [{ to: '/industry/dashboard', label: 'nav.dashboard', icon: LayoutDashboard }];

const GOVERNMENT_NAV = [
  { to: '/government/dashboard', label: 'nav.dashboard', icon: LayoutDashboard },
  { to: '/challenges', label: 'nav.exploreChallenges', icon: Compass },
];

export const getNavItemsForRole = (role) => {
  switch (role) {
    case 'citizen':
      return CITIZEN_NAV;
    case 'university':
      return UNIVERSITY_NAV;
    case 'industry':
      return INDUSTRY_NAV;
    case 'government':
      return GOVERNMENT_NAV;
    case 'admin':
      return adminNavItems;
    default:
      return [];
  }
};
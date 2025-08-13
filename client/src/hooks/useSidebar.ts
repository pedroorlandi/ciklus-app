import { useState, useEffect } from 'react';

export function useSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Check localStorage for saved sidebar state, padrão minimizada
    const saved = localStorage.getItem('ciklus-sidebar-collapsed');
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    // Save sidebar state to localStorage when it changes
    localStorage.setItem('ciklus-sidebar-collapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const closeSidebar = () => setIsCollapsed(true);
  const openSidebar = () => setIsCollapsed(false);

  return {
    isCollapsed,
    toggleSidebar,
    closeSidebar,
    openSidebar,
  };
}
import React, { ReactNode } from 'react'

interface DashboardWidgetProps {
  children: ReactNode;
  variant: 'summary' | 'tasklist';
}

export function DashboardWidget({ children, variant }: DashboardWidgetProps) {
  const baseClasses = "card p-6";
  
  const variantClasses = {
    summary: "hover:shadow-lg transition-shadow duration-200",
    tasklist: "max-h-96 overflow-y-auto"
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </div>
  );
}
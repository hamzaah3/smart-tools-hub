'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TOOLS, TOOL_CATEGORIES, type ToolCategory } from '@/lib/tools-registry';
import { Badge } from '@/components/ui/badge';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

export function AppSidebar() {
  const pathname = usePathname();
  
  // Group tools by category
  const toolsByCategory = TOOLS.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<ToolCategory, typeof TOOLS>);

  return (
    <Sidebar>
      <SidebarContent>
        {Object.entries(toolsByCategory).map(([category, tools]) => (
          <SidebarGroup key={category}>
            <SidebarGroupLabel className="text-xs font-bold uppercase tracking-wider">
              {TOOL_CATEGORIES[category as ToolCategory].name}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {tools.map((tool) => {
                  const Icon = tool.icon;
                  const isActive = pathname === tool.href;
                  
                  return (
                    <SidebarMenuItem key={tool.id}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={tool.href}>
                          <Icon className="h-4 w-4" />
                          <span>{tool.name}</span>
                          {tool.new && (
                            <Badge className="ml-auto bg-green-500 text-white text-[9px] px-1.5 py-0">
                              NEW
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}

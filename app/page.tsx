"use client";

import dynamic from 'next/dynamic';
import { useState, useCallback } from "react";
import { SidebarItem } from "@/components/SidebarItem";
import { MapIcon, MusicalNoteIcon, ChatBubbleBottomCenterIcon } from '@heroicons/react/24/outline';

// 面板数据类型
export interface PanelData {
  id: string;
  icon: any;
  isOpen: boolean;
  content: string;
}

// 动态导入客户端拖拽区域，完全禁用 SSR
const ClientPanels = dynamic(
  () => import("@/components/ClientPanels").then((mod) => mod.ClientPanels),
  { ssr: false }
);
// 初始面板数据
const initialPanels: PanelData[] = [
  {
    id: "1",
    icon: <MapIcon className="h-6 w-6" />,
    isOpen: true,
    content: "map",
  },
  {
    id: "2",
    icon: <MusicalNoteIcon className="h-6 w-6" />,
    isOpen: true,
    content: "music",
  },
  {
    id: "3",
    icon: <ChatBubbleBottomCenterIcon className="h-6 w-6" />,
    isOpen: true,
    content: "chat",
  },
];

export default function Home() {
  const [panels, setPanels] = useState<any[]>(initialPanels);

  const togglePanel = useCallback((panelId: string) => {
    setPanels((prev) => {
      const newPanels = prev.map(p =>
        p.id === panelId ? { ...p, isOpen: !p.isOpen } : p
      );
      const open = newPanels.filter(p => p.isOpen);
      const closed = newPanels.filter(p => !p.isOpen);
      return [...open, ...closed];
    });
  }, []);

  const openCount = panels.filter(p => p.isOpen).length;

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* 左侧菜单 */}
      <aside className="w-18 bg-white shadow-lg flex-shrink-0 flex flex-col">
        <nav className="flex-1 overflow-y-auto p-2">
          {panels.map((panel) => (
            <SidebarItem key={panel.id} panel={panel} onToggle={togglePanel} />
          ))}
        </nav>
      </aside>

      {/* 右侧区域 */}
      <div className="flex-1 flex flex-col min-w-0">
        <ClientPanels panels={panels} setPanels={setPanels} />
      </div>
    </div>
  );
}
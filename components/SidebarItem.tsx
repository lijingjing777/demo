"use client";

interface SidebarItemProps {
  panel: any;
  onToggle: (id: string) => void;
}

export function SidebarItem({ panel, onToggle }: SidebarItemProps) {
  const { id, icon, isOpen } = panel;

  return (
    <div
      onClick={() => onToggle(id)}
      className={`
        flex items-center justify-between p-3 rounded-lg mb-2
        transition-all duration-200 group
        ${isOpen ? "bg-gray-50 hover:bg-gray-100" : "bg-gray-50/50 hover:bg-gray-100/70"}
      `}
    >
      <div className="flex items-center gap-3 flex-1">
        {/* 图标 - 关闭时透明灰色 */}
        <div
          className={`
            text-2xl transition-all duration-200
            ${!isOpen && "opacity-40 grayscale"}
          `}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
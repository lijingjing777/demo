"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export interface PanelData {
  id: string;
  icon: string;
  isOpen: boolean;
  content: string;
}
interface PanelProps {
  panel: PanelData;
  onClose: (id: string) => void;
}

export function Panel({ panel, onClose }: PanelProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: panel.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        w-80 flex-shrink-0 bg-white rounded-xl shadow-md 
        flex flex-col overflow-hidden transition-all duration-200
        ${isDragging ? "shadow-2xl rotate-1 scale-105" : "hover:shadow-lg"}
      `}
    >
      {/* 可拖拽的顶部区域 */}
      <div
        className="bg-gray-300 px-4 py-3 cursor-grab active:cursor-grabbing select-none"
        {...attributes}
        {...listeners}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-white text-xl">{panel.icon}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose(panel.id);
            }}
            aria-label="关闭面板"
          >
            ✕
          </button>
        </div>
      </div>

      {/* 面板内容区域 */}
      <div className="p-4 flex-1">
        <div className="text-gray-600 text-sm leading-relaxed">
          {panel.content}
        </div>
      </div>

      {/* 底部装饰 */}
      <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
    </div>
  );
}
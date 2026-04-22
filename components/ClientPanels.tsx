"use client";

import { useRef } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { Panel, PanelData } from "@/components/Panel";

interface ClientPanelsProps {
  panels: PanelData[];
  setPanels: React.Dispatch<React.SetStateAction<PanelData[]>>;
}

export function ClientPanels({ panels, setPanels }: ClientPanelsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const openPanels = panels.filter((panel) => panel.isOpen);
  const openPanelIds = openPanels.map((panel) => panel.id);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = openPanelIds.indexOf(active.id as string);
      const newIndex = openPanelIds.indexOf(over.id as string);
      if (oldIndex !== -1 && newIndex !== -1) {
        const newOpenPanels = arrayMove(openPanels, oldIndex, newIndex);
        const closedPanels = panels.filter((panel) => !panel.isOpen);
        setPanels([...newOpenPanels, ...closedPanels]);
      }
    }
  };

  if (openPanels.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        已全部关闭，点击左侧图标可以重新打开
      </div>
    );
  }

  return (
    <div
      ref={scrollContainerRef}
      className="flex-1 overflow-x-auto overflow-y-auto p-4 custom-scrollbar"
      style={{ scrollBehavior: "smooth" }}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToParentElement]}
      >
        <SortableContext
          items={openPanelIds}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex gap-5 min-h-full pb-4" style={{ minWidth: "min-content" }}>
            {openPanels.map((panel) => (
              <Panel key={panel.id} panel={panel} onClose={(id) => {
                setPanels(prev => {
                  const newPanels = prev.map(p =>
                    p.id === id ? { ...p, isOpen: false } : p
                  );
                  const open = newPanels.filter(p => p.isOpen);
                  const closed = newPanels.filter(p => !p.isOpen);
                  return [...open, ...closed];
                });
              }} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
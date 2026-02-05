import { useDraggable } from "@dnd-kit/core";
import { TaskDB } from "../../types";
import * as React from "react";

interface GantTaskProps {
  task: TaskDB;
  index: number;
}

export default function GantTask({ task, index }: GantTaskProps) {
  const HOUR_WIDTH_PX = 70; // Pixels per hour
  const START_HOUR_DISPLAY = 7; // Start time for the visible grid (7 AM)
  let widthPx = (task.Duration / 60) * HOUR_WIDTH_PX;

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: String(task.id),
  });

  const {
    attributes: resizeAttributes,
    listeners: resizeListeners,
    setNodeRef: setResizeNodeRef,
    transform: resizeTransform,
  } = useDraggable({
    id: `resize-${String(task.id)}`,
  });

  const handleResizeMouseDown = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (resizeTransform) widthPx += resizeTransform.x;
  }, []);

  const style = {
    left: `${(task.startTime.getHours() - START_HOUR_DISPLAY) * HOUR_WIDTH_PX
      }px`,
    width: widthPx,
    top: `${index * 48 + 8}px`,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="absolute h-8 rounded-lg select-none cursor-grab active:cursor-grabbing flex items-center
                justify-between px-3 text-white text-sm font-medium bg-blue-600 shadow-md
                hover:bg-blue-500 hover:shadow-lg transition-all duration-150 border border-blue-500/50"
      style={style}
    >
      <span className="truncate pointer-events-none select-none">
        {task.name}
      </span>
      <div
        ref={setResizeNodeRef}
        {...resizeListeners}
        {...resizeAttributes}
        className="task-resizer w-2 h-full cursor-ew-resize absolute right-0 top-0 rounded-r-lg
                   hover:bg-blue-400/50 transition-colors"
        onMouseDown={handleResizeMouseDown}
      />
    </div>
  );
}

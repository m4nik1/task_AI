import { useDraggable } from "@dnd-kit/core";
import { TaskDB } from "../../types";
import { useCallback } from "react";

interface GantTaskProps {
  task: TaskDB;
  index: number;
}

export default function GantTask({ task, index }: GantTaskProps) {
  const HOUR_WIDTH_PX = 70; // Pixels per hour
  const START_HOUR_DISPLAY = 7; // Start time for the visible grid (7 AM)
  let widthPx = (task.Duration / 60) * HOUR_WIDTH_PX;

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const { attributes: resizeAttributes, 
          listeners: resizeListeners, 
          setNodeRef: setResizeNodeRef, 
          transform: resizeTransform } = useDraggable({
    id: `resize-${task.id}`,
  });

   const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if(resizeTransform)   widthPx += resizeTransform.x;
  }, []);

   const style = {
    left: `${
      (task.startTime.getHours() - START_HOUR_DISPLAY) * HOUR_WIDTH_PX
    }px`,
    width: widthPx, 
    top: `${index * 40 + 10}px`,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  
  return ( 
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`absolute h-8 rounded select-none active:cursor-grabbing flex items-center
                justify-between px-2 text-white font-medium bg-blue-500`}
      style={style}
    >
      <span className="truncate pointer-events-none select-none">
        {task.name}
      </span>
      <div 
        ref={setResizeNodeRef} 
        {...resizeListeners} 
        {...resizeAttributes} 
        className={`task-resizer w-3 h-full cursor-ew-resize absolute right-0 top-0`} 
        onMouseDown={handleResizeMouseDown} 
      ></div>
    </div>
  );
}

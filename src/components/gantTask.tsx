import { useDraggable } from "@dnd-kit/core";
import { TaskDB } from "../../types";
import { useCallback, useEffect, useState } from "react";

interface GantTaskProps {
  task: TaskDB;
  index: number;
  onResize: (taskID: number, newDuration: number) => void;
}

export default function GantTask({ task, index, onResize }: GantTaskProps) {
  const HOUR_WIDTH_PX = 70; // Pixels per hour
  const START_HOUR_DISPLAY = 7; // Start time for the visible grid (7 AM)

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id.toString(),
  });

  const { attributes: resizeAttributes, listeners: resizeListeners, setNodeRef: setResizeNodeRef } = useDraggable({
    id: `resize-${task.id}`,
  });

  const [isResizing, setIsResizing] = useState(false)

  const style = {
    left: `${
      (task.startTime.getHours() - START_HOUR_DISPLAY) * HOUR_WIDTH_PX
    }px`,
    width: (task.Duration / 60) * HOUR_WIDTH_PX,
    top: `${index * 40 + 10}px`,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setIsResizing(true);
  }, [])

  const handleResizeMouseUp = useCallback(() => {
    setIsResizing(false);
  }, [])

  // const handleResizeEnd = useCallback(({ delta } : any) => {
  //   if(onResize && isResizing) {
  //     const minutesPerPx = 60 / HOUR_WIDTH_PX;
  //     const deltaMin = delta.x * minutesPerPx;
  //     const newDuration = Math.max(15, task.Duration + Math.round(deltaMinutes / 15) * 15);

  //     onResize(task.id, newDuration)
  //   }
  //   setIsResizing(false)
  // }, [onResize, isResizing, setIsResizing, HOUR_WIDTH_PX, task.Duration, task.id])

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
        onMouseUp={handleResizeMouseUp}
      ></div>
    </div>
  );
}

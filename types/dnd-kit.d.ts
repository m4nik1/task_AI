import * as React from "react";

declare module "@dnd-kit/core" {
  export function DndContext(props: any): React.ReactNode;
}

declare module "@dnd-kit/sortable" {
  export function SortableContext(props: any): React.ReactNode;
}

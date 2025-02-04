import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AgendaItem } from "../types";
import styles from "./SortableAgendaItem.module.css";
import { useState, MouseEvent, useCallback, useRef } from "react";
import { ContextMenu } from "./ContextMenu";

interface Props {
  item: AgendaItem;
  onDurationChange?: (id: string, duration: number) => void;
  onRemove?: (id: string) => void;
  onRename?: (id: string, name: string) => void;
}

export function SortableAgendaItem({ item, onDurationChange, onRemove, onRename }: Props) {
  const [isDraggingDuration, setIsDraggingDuration] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(item.name);
  const itemRef = useRef<HTMLDivElement>(null);

  const dragRef = useRef({
    startX: 0,
    currentX: 0,
    startDuration: 0,
    lastDuration: item.duration,
  });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ 
    id: item.id,
    resizeObserverConfig: {
      disabled: true
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleDurationMouseMove = useCallback((e: globalThis.MouseEvent) => {
    if (!isDraggingDuration || !itemRef.current) return;
    
    const diff = Math.round((e.clientX - dragRef.current.startX) / 10);
    const newDuration = Math.max(5, Math.min(30, dragRef.current.startDuration + diff));
    
    if (newDuration !== dragRef.current.lastDuration) {
      dragRef.current.lastDuration = newDuration;
      dragRef.current.currentX = e.clientX;
      onDurationChange?.(item.id, newDuration);
    }
  }, [isDraggingDuration, item.id, onDurationChange]);

  const handleDurationMouseUp = useCallback(() => {
    if (isDraggingDuration) {
      setIsDraggingDuration(false);
      document.removeEventListener('mousemove', handleDurationMouseMove);
      document.removeEventListener('mouseup', handleDurationMouseUp);
      document.body.style.cursor = '';
    }
  }, [isDraggingDuration, handleDurationMouseMove]);

  const handleDurationMouseDown = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    document.body.style.cursor = 'none';
    
    dragRef.current = {
      startX: e.clientX,
      currentX: e.clientX,
      startDuration: item.duration,
      lastDuration: item.duration,
    };
    
    setIsDraggingDuration(true);
    document.addEventListener('mousemove', handleDurationMouseMove);
    document.addEventListener('mouseup', handleDurationMouseUp);
  };

  const handleNameClick = () => {
    setIsEditing(true);
  };

  const handleRename = () => {
    if (editedName.trim() !== item.name) {
      onRename?.(item.id, editedName.trim());
    }
    setIsEditing(false);
  };

  return (
    <>
      <div
        ref={(el) => {
          setNodeRef(el);
          itemRef.current = el;
        }}
        style={style}
        className={`${styles.item} ${isDraggingDuration ? styles.dragging : ''}`}
        onContextMenu={handleContextMenu}
      >
        <div className={styles.content}>
          <span 
            className={styles.duration}
            onMouseDown={handleDurationMouseDown}
          >
            {item.duration}m
          </span>
          {isEditing ? (
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRename();
                if (e.key === 'Escape') {
                  setEditedName(item.name);
                  setIsEditing(false);
                }
              }}
              className={styles.nameInput}
              autoFocus
            />
          ) : (
            <span 
              className={styles.name}
              onClick={handleNameClick}
            >
              {item.name}
            </span>
          )}
        </div>
        <div 
          className={styles.dragHandle} 
          {...attributes} 
          {...listeners}
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M7 2.75C7 2.33579 7.33579 2 7.75 2H8.25C8.66421 2 9 2.33579 9 2.75V3.25C9 3.66421 8.66421 4 8.25 4H7.75C7.33579 4 7 3.66421 7 3.25V2.75Z" 
              fill="currentColor"
            />
            <path 
              d="M7 7.75C7 7.33579 7.33579 7 7.75 7H8.25C8.66421 7 9 7.33579 9 7.75V8.25C9 8.66421 8.66421 9 8.25 9H7.75C7.33579 9 7 8.66421 7 8.25V7.75Z" 
              fill="currentColor"
            />
            <path 
              d="M7 12.75C7 12.3358 7.33579 12 7.75 12H8.25C8.66421 12 9 12.3358 9 12.75V13.25C9 13.6642 8.66421 14 8.25 14H7.75C7.33579 14 7 13.6642 7 13.25V12.75Z" 
              fill="currentColor"
            />
          </svg>
        </div>
        {isDraggingDuration && (
          <div 
            className={styles.durationHighlight} 
            style={{ 
              width: `${(item.duration / 30) * 100}%`,
            }} 
          />
        )}
      </div>
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onRemove={() => {
            onRemove?.(item.id);
            setContextMenu(null);
          }}
          onClose={() => setContextMenu(null)}
        />
      )}
    </>
  );
} 
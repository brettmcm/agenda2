'use client';

import { useState, KeyboardEvent } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import styles from "./page.module.css";
import { AgendaItem } from "./types";
import { SortableAgendaItem } from "./components/SortableAgendaItem";
import { AgendaFooter } from "./components/AgendaFooter";

export default function Home() {
  const [title, setTitle] = useState("Agenda");
  const [newItemName, setNewItemName] = useState("");
  const [items, setItems] = useState<AgendaItem[]>([]);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showErrorPlaceholder, setShowErrorPlaceholder] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Format the current date
  const today = new Date();
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
  const monthName = today.toLocaleDateString('en-US', { month: 'long' });
  const date = today.getDate();
  const formattedDate = `${dayName}, ${monthName} ${date}`;

  const handleAddItem = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (!newItemName.trim()) {
        setIsError(true);
        setShowErrorPlaceholder(true);
        setTimeout(() => setIsError(false), 1000);
      } else {
        const newItem: AgendaItem = {
          id: Date.now().toString(),
          name: newItemName.trim(),
          duration: 5,
        };
        setItems([...items, newItem]);
        setNewItemName("");
        setShowErrorPlaceholder(false);
      }
    }
  };

  const handleInputBlur = () => {
    setNewItemName("");
    setShowErrorPlaceholder(false);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleUpdateItem = (id: string, name: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, name: name.trim() } : item
    ));
  };

  const handleUpdateDuration = (id: string, duration: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, duration } : item
    ));
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleRenameItem = (id: string, name: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, name } : item
    ));
  };

  const totalDuration = items.reduce((sum, item) => sum + item.duration, 0);

  const handleClearAll = () => {
    setItems([]);
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {isEditingTitle ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => setIsEditingTitle(false)}
            onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
            className={styles.titleInput}
            autoFocus
          />
        ) : (
          <h1 
            className={styles.title}
            onClick={() => setIsEditingTitle(true)}
          >
            {title}
          </h1>
        )}
        <div className={styles.date}>{formattedDate}</div>

        <div className={styles.inputContainer}>
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyDown={handleAddItem}
            onBlur={handleInputBlur}
            placeholder={showErrorPlaceholder ? "Item title cannot be left blank!" : "Add agenda item"}
            className={`${styles.input} ${isError ? styles.error : ''}`}
          />
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items}
            strategy={verticalListSortingStrategy}
          >
            <div className={styles.list}>
              {items.map((item) => (
                <SortableAgendaItem 
                  key={item.id} 
                  item={item}
                  onDurationChange={handleUpdateDuration}
                  onRemove={handleRemoveItem}
                  onRename={handleRenameItem}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {items.length > 0 && (
          <AgendaFooter 
            totalDuration={totalDuration}
            onClearAll={handleClearAll}
          />
        )}
      </div>
    </main>
  );
}

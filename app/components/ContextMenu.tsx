import { useEffect, useRef } from 'react';
import styles from './ContextMenu.module.css';

interface Props {
  x: number;
  y: number;
  onRemove: () => void;
  onClose: () => void;
}

export function ContextMenu({ x, y, onRemove, onClose }: Props) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div 
      ref={menuRef}
      className={styles.menu} 
      style={{ 
        left: x, 
        top: y 
      }}
    >
      <button onClick={onRemove} className={styles.menuItem}>
        Remove
      </button>
    </div>
  );
} 
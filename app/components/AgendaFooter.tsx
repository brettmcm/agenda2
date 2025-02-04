import styles from './AgendaFooter.module.css';

interface Props {
  totalDuration: number;
  onClearAll: () => void;
}

export function AgendaFooter({ totalDuration, onClearAll }: Props) {
  return (
    <div className={styles.footer}>
      <span className={styles.total}>{totalDuration} minutes total</span>
      <button onClick={onClearAll} className={styles.clearButton} title="Clear all items">
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 16 16" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M5.5 2C5.5 1.44772 5.94772 1 6.5 1H9.5C10.0523 1 10.5 1.44772 10.5 2V3H13.5C13.7761 3 14 3.22386 14 3.5C14 3.77614 13.7761 4 13.5 4H2.5C2.22386 4 2 3.77614 2 3.5C2 3.22386 2.22386 3 2.5 3H5.5V2ZM6.5 2V3H9.5V2H6.5Z"
            fill="currentColor"
          />
          <path 
            d="M3.5 5C3.5 4.72386 3.72386 4.5 4 4.5C4.27614 4.5 4.5 4.72386 4.5 5V13C4.5 13.5523 4.94772 14 5.5 14H10.5C11.0523 14 11.5 13.5523 11.5 13V5C11.5 4.72386 11.7239 4.5 12 4.5C12.2761 4.5 12.5 4.72386 12.5 5V13C12.5 14.1046 11.6046 15 10.5 15H5.5C4.39543 15 3.5 14.1046 3.5 13V5Z"
            fill="currentColor"
          />
          <path 
            d="M6.5 6C6.5 5.72386 6.72386 5.5 7 5.5C7.27614 5.5 7.5 5.72386 7.5 6V11C7.5 11.2761 7.27614 11.5 7 11.5C6.72386 11.5 6.5 11.2761 6.5 11V6Z"
            fill="currentColor"
          />
          <path 
            d="M9 5.5C8.72386 5.5 8.5 5.72386 8.5 6V11C8.5 11.2761 8.72386 11.5 9 11.5C9.27614 11.5 9.5 11.2761 9.5 11V6C9.5 5.72386 9.27614 5.5 9 5.5Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  );
} 
interface PolicyListProps {
    items: string[];
  }
  
export function PolicyList({ items }: PolicyListProps) {
    return (
      <ul className="list-disc pl-6 space-y-2 text-custom-text/80 dark:text-custom-darkText/80">
        {items.map((item, index) => (
          <li key={index} className="pl-2">{item}</li>
        ))}
      </ul>
    );
  }

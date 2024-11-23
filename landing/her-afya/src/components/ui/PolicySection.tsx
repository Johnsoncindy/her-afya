interface PolicySectionProps {
    title: string;
    children: React.ReactNode;
    levelTwo?: boolean;
  }
  
export function PolicySection({ title, children, levelTwo = false }: PolicySectionProps) {
    const HeadingComponent = levelTwo ? 'h3' : 'h2';
    const className = levelTwo 
      ? "text-xl font-semibold text-custom-text/90 dark:text-custom-darkText/90 mt-8 mb-4"
      : "text-2xl font-bold text-custom-text dark:text-custom-darkText mt-12 mb-6";
  
    return (
      <section className="mb-8">
        <HeadingComponent className={className}>{title}</HeadingComponent>
        {children}
      </section>
    );
  }

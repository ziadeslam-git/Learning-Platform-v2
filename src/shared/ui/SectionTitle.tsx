import { cn } from '../../lib/utils';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export function SectionTitle({ title, subtitle, className, align = 'center' }: SectionTitleProps) {
  return (
    <div className={cn('flex flex-col gap-3', {
      'items-start text-left': align === 'left',
      'items-center text-center': align === 'center',
      'items-end text-right': align === 'right',
    }, className)}>
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white glow-text">
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-400 max-w-2xl text-base md:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}

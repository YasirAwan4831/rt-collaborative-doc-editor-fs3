import { cn } from '../../utils/cn.js';

export function Avatar({ name, src, size = 'md', className, online }) {
  const sizes = { sm: 'h-7 w-7 text-xs', md: 'h-9 w-9 text-sm', lg: 'h-11 w-11' };
  const initials = name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={cn('relative inline-flex', className)}>
      {src ? (
        <img src={src} alt={name} className={cn('rounded-full object-cover', sizes[size])} />
      ) : (
        <span
          className={cn(
            'flex items-center justify-center rounded-full bg-brand-500/15 font-semibold text-brand-700 dark:text-brand-300',
            sizes[size],
          )}
        >
          {initials || '?'}
        </span>
      )}
      {online !== undefined && (
        <span
          className={cn(
            'absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface',
            online ? 'bg-emerald-500' : 'bg-gray-400',
          )}
        />
      )}
    </div>
  );
}

export default Avatar;

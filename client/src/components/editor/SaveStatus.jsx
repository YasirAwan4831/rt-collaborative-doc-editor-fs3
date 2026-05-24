import { Cloud, CloudOff, Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn.js';

const statusConfig = {
  saved: { icon: Cloud, label: 'All changes saved', color: 'text-emerald-600' },
  saving: { icon: Loader2, label: 'Saving...', color: 'text-brand-600', spin: true },
  unsaved: { icon: CloudOff, label: 'Unsaved changes', color: 'text-amber-600' },
  error: { icon: CloudOff, label: 'Save failed', color: 'text-red-600' },
};

export function SaveStatus({ status }) {
  const config = statusConfig[status] || statusConfig.saved;
  const Icon = config.icon;

  return (
    <span className={cn('flex items-center gap-1.5 text-xs font-medium', config.color)}>
      <Icon className={cn('h-3.5 w-3.5', config.spin && 'animate-spin')} />
      {config.label}
    </span>
  );
}

export default SaveStatus;

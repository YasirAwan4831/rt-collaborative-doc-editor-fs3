import { Button } from '../common/Button.jsx';

export function SSOButton({ provider, icon: Icon, onClick, loading }) {
  return (
    <Button variant="secondary" className="w-full" onClick={onClick} loading={loading}>
      {Icon && <Icon className="h-5 w-5" />}
      Continue with {provider}
    </Button>
  );
}

export default SSOButton;

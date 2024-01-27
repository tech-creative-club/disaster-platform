import { t } from 'i18next';

interface PointerDetailsProps {
  title: string;
  address?: string;
}

export default function PointerDatails({ title, address }: PointerDetailsProps): React.JSX.Element {
  return (
    <div className="z-50 h-fit w-60 truncate rounded-lg bg-white p-5">
      <p className="truncate text-sm font-medium text-zinc-900">{title}</p>
      {typeof address !== 'undefined' && address !== 'undefined undefined' ? (
        <p className="truncate pt-0.5 text-xs font-normal text-zinc-400">{address}</p>
      ) : (
        <p className="truncate pt-0.5 text-xs font-normal text-zinc-400">{t('Could not display')}</p>
      )}
    </div>
  );
}

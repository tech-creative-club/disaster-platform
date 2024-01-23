import { FaPen } from 'react-icons/fa';

interface Props {
  [key: string]: any;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  message?: string;
}

export default function ProvideInformationButton(props: Props): React.JSX.Element {
  return (
    <button
      className={`my-3 flex items-center rounded-full border border-gray-300 px-4 py-1.5 text-sm transition-colors duration-150 ease-in-out hover:bg-zinc-50 disabled:bg-zinc-200 disabled:text-zinc-900 disabled:hover:bg-zinc-200 ${props.className}`}
      onClick={props.onClick}
    >
      {props?.icon !== 'disable' && <FaPen className="mr-2 pb-0.5" size="13" />}
      {props.message ? props.message : '情報提供をする'}
    </button>
  );
}


interface TextProps {
  key: string;
  type: "submit" | "reset" | "button";
  label: string;
  status?: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function Submit({ key, type, label, onClick, status }: TextProps) {
  return (<>
    <button
      key={key}
      type={type}
      disabled={status === 'loading'}
      className="btn btn-primary"
      onClick={onClick}
    >{label}</button>
  </>);
}
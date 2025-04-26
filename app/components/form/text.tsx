
interface TextProps {
  key: string
  type: string;
  name: string;
  label?: string;
  placeholder: string;
  required: boolean;
  value: string;
  help?: string;
  status?: string;
  readOnly?: boolean;
  onChange: (value: string) => void;
}

export default function Text({ key, type, name, label, required, placeholder, readOnly, value, help, onChange }: TextProps) {
  return (<>
    <div className="mb-3" key={key}>
      {label &&
        <label htmlFor={`input-${name}`} className="form-label">{label}</label>
      }
      {help && <div id={`${name}Help`} className="form-text">{help}</div>}
      <input
        type={type}
        className="form-control"
        aria-describedby={`${name}Help`}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        placeholder={placeholder}
        value={value}
        required={required}
      />
    </div>
  </>);
}
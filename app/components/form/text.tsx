interface TextProps {
  key: string;
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

export default function Text({
  key,
  type,
  name,
  label,
  required,
  placeholder,
  readOnly,
  value,
  help,
  onChange,
}: TextProps) {
  const viewType = type === "image" ? "text" : type; // Use 'text' for image type to avoid input issues
  return (
    <>
      <div className="mb-3" key={key}>
        {label && (
          <label htmlFor={`input-${name}`} className="form-label">
            {label}
          </label>
        )}
        {help && (
          <div id={`${name}Help`} className="form-text">
            {help}
          </div>
        )}
        {type === "image" ? (
          <div className="row">
            <div className="col-11">
              <input
                type={viewType}
                className="form-control"
                aria-describedby={`${name}Help`}
                onChange={(e) => onChange(e.target.value)}
                readOnly={readOnly}
                placeholder={placeholder}
                value={value}
                required={required}
              />
            </div>
            <div className="col-1">
              {value && value.startsWith("http") && (
                <img
                  src={value}
                  alt={label || name}
                  className="img-fluid"
                  style={{ maxHeight: "200px", objectFit: "contain" }}
                />
              )}
            </div>
          </div>
        ) : (
          <input
            type={viewType}
            className="form-control"
            aria-describedby={`${name}Help`}
            onChange={(e) => onChange(e.target.value)}
            readOnly={readOnly}
            placeholder={placeholder}
            value={value}
            required={required}
          />
        )}
      </div>
    </>
  );
}

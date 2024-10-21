
interface TextAreaProps {
	key: string
	name: string;
	label: string;
	row?: number;
	placeholder: string;
	required: boolean;
	value: string;
	help?: string;
	status?: string;
	onChange: (value: string) => void;
}

export default function TextArea({ key, name, row, label, required, placeholder, value, help, onChange }: TextAreaProps) {
	return (<>
		<div className="mb-3" key={key}>
			<label htmlFor={`input-${name}`} className="form-label">{label}</label>
			{help && <div id={`${name}Help`} className="form-text">{help}</div>}
			<textarea
				className="form-control"
				style={{ height: 'auto' }}
				rows={row || 3}
				aria-describedby={`${name}Help`}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				value={value}
				required={required}
			>{value}</textarea>
		</div>
	</>);
}
interface SelectProps {
	key: string
	type: string;
	name: string;
	label: string;
	placeholder: string;
	required: boolean;
	value: string;
	help?: string;
	options: { value: string | boolean, label: string }[];
	status?: string;
	onChange: (value: string) => void;
}

export default function Select({ key, name, options, label, required, placeholder, value, help, onChange }: SelectProps) {
	return (<>
		<div className="mb-3" key={key}>
			<label htmlFor={`input-${name}`} className="form-label">{label}</label>
			{help && <div id={`${name}Help`} className="form-text">{help}</div>}
			<select
				className="form-select"
				onChange={(e) => onChange(e.target.value)}
				required={required}
				value={value}
			>
				<option value="">{placeholder}</option>
				{options.map((option, i) => (
					<option
						key={i}
						value={`${option.value}`}
					>{option.label}</option>
				))}
			</select>
		</div>
	</>);
}
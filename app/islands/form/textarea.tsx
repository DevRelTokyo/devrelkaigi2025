
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
	onChange: (e: any) => void;
}

export default function TextArea({ key, name, row, label, required, placeholder, value, help, onChange }: TextAreaProps) {
	return (<>
		<div class="mb-3" key={key}>
			<label for={`input-${name}`} class="form-label">{label}</label>
			{help && <div id={`${name}Help`} class="form-text">{help}</div>}
			<textarea
				class="form-control"
				style={{ height: 'auto' }}
				rows={row || 3}
				aria-describedby={`${name}Help`}
				onChange={onChange}
				placeholder={placeholder}
				value={value}
				required={required}
			>{value}</textarea>
		</div>
	</>);
}
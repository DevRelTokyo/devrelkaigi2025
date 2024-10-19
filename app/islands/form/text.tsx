
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
	onChange: (e: any) => void;
}

export default function Text({ key, type, name, label, required, placeholder, readOnly, value, help, onChange }: TextProps) {
	return (<>
		<div class="mb-3" key={key}>
			{ label &&
				<label for={`input-${name}`} class="form-label">{label}</label>
			}
			{help && <div id={`${name}Help`} class="form-text">{help}</div>}
			<input
				type={type}
				class="form-control"
				aria-describedby={`${name}Help`}
				onChange={onChange}
				readonly={readOnly}
				placeholder={placeholder}
				value={value}
				required={required}
			/>
		</div>
	</>);
}
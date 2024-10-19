
interface TextProps {
	key: string
	type: string;
	name: string;
	label: string;
	placeholder: string;
	required: boolean;
	value: string;
	help?: string;
	options: { value: string, label: string }[];
	status?: string;
	onChange: (e: any) => void;
}

export default function Select({ key, type, name, options, label, required, placeholder, value, help, onChange }: TextProps) {
	return (<>
		<div class="mb-3" key={key}>
			<label for={`input-${name}`} class="form-label">{label}</label>
			{help && <div id={`${name}Help`} class="form-text">{help}</div>}
			<select
				class="form-select"
				onChange={onChange}
				required={required}
			>
				<option value="">{placeholder}</option>
				{options.map(option => (
					<option
						value={option.value}
						selected={option.value === value}
					>{option.label}</option>
				))}
			</select>
		</div>
	</>);
}
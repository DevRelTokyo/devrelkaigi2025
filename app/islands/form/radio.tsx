
interface RadioProps {
	name: string;
	label: string;
	options: { value: string, label: string }[];
	onChange: (e: any) => void;
	value: string;
	required: boolean;
}

export default function Radio({ name, label, options, value, required, onChange }: RadioProps) {
	return (<>
		<div class="mb-3">
			<strong><label for={`input-${name}`} class="form-label">{label}</label></strong>
		</div>
		{ options.map(option => (
			<div class="mb-3 form-check">
				<input
					class="form-check-input"
					type="radio"
					name={name}
					value={option.value}
					onChange={onChange}
					required={required}
					checked={`${option.value}` === `${value}`}
					id={`radio-${name}-${option.value}`}
				/>
				<label class="form-check-label" for={`radio-${name}-${option.value}`}>
					{option.label}
				</label>
			</div>
		))}
	</>);
}
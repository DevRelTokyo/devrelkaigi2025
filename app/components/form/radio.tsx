
interface RadioProps {
	name: string;
	label: string;
	options: { value: string | boolean, label: string }[];
	onChange: (value: boolean) => void;
	value: string;
	required: boolean;
	status?: string;
}

export default function Radio({ name, label, options, value, required, onChange }: RadioProps) {
	return (<>
		<div className="mb-3">
			<strong><label htmlFor={`input-${name}`} className="form-label">{label}</label></strong>
		</div>
		{ options.map((option, i) => (
			<div key={i} className="mb-3 form-check">
				<input
					className="form-check-input"
					type="radio"
					name={name}
					value={`${option.value}`}
					onChange={(e) => {
						onChange(e.target.checked);
					}}
					required={required}
					checked={`${option.value}` === `${value}`}
					id={`radio-${name}-${option.value}`}
				/>
				<label className="form-check-label" htmlFor={`radio-${name}-${option.value}`}>
					{option.label}
				</label>
			</div>
		))}
	</>);
}

interface CheckboxProps {
	name: string;
	label: string;
	options: { value: string, label: string }[];
	value: string;
	required: boolean;
	onChange: (e: any) => void;
}

export default function Checkbox({ name, label, options, value, required, onChange }: CheckboxProps) {
	return (<>
		{ options.length === 1 ?
			(<div class="mb-3 form-check">
				<input
					class="form-check-input"
					type="checkbox"
					name={name}
					value={options[0].value}
					onChange={onChange}
					required={required}
					checked={`${options[0].value}` === `${value}`}
					id={`checkbox-${name}-${options[0].value}`}
				/>
				<label class="form-check-label" for={`checkbox-${name}-${options[0].value}`}>
					{label}
				</label>
			</div>) :
			<>
				<div class="mb-3">
					<strong><label for={`input-${name}`} class="form-label">{label}</label></strong>
				</div>
				{options.map(option => (
					<div class="mb-3 form-check">
						<input
							class="form-check-input"
							type="checkbox"
							name={name}
							value={option.value}
							onChange={onChange}
							required={required}
							checked={`${option.value}` === `${value}`}
							id={`checkbox-${name}-${option.value}`}
						/>
						<label class="form-check-label" for={`checkbox-${name}-${option.value}`}>
							{option.label}
						</label>
					</div>
				))}
			</>
		}
	</>);
}
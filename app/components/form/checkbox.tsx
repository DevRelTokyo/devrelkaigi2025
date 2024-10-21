
interface CheckboxProps {
	name: string;
	label: string;
	options: { value: string, label: string }[];
	value: string;
	required: boolean;
	onChange: (value: string) => void;
	status?: string;
}

export default function Checkbox({ name, label, options, value, required, onChange }: CheckboxProps) {
	return (<>
		{ options.length === 1 ?
			(<div className="mb-3 form-check">
				<input
					className="form-check-input"
					type="checkbox"
					name={name}
					value={`${options[0].value}`}
					onChange={(e) => onChange(e.target.value)}
					required={required}
					checked={`${options[0].value}` === `${value}`}
					id={`checkbox-${name}-${options[0].value}`}
				/>
				<label className="form-check-label" htmlFor={`checkbox-${name}-${options[0].value}`}>
					{label}
				</label>
			</div>) :
			<>
				<div className="mb-3">
					<strong><label htmlFor={`input-${name}`} className="form-label">{label}</label></strong>
				</div>
				{options.map((option, i) => (
					<div key={i} className="mb-3 form-check">
						<input
							className="form-check-input"
							type="checkbox"
							name={name}
							value={option.value}
							onChange={(e) => onChange(e.target.value)}
							required={required}
							checked={`${option.value}` === `${value}`}
							id={`checkbox-${name}-${option.value}`}
						/>
						<label className="form-check-label" htmlFor={`checkbox-${name}-${option.value}`}>
							{option.label}
						</label>
					</div>
				))}
			</>
		}
	</>);
}
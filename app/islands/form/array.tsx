import { useEffect, useState } from "hono/jsx";
import Text from "./text";

interface ArrayProps {
	key: string
	name: string;
	label: string;
	value: string[] | undefined;
	help?: string;
	status?: string;
	schema: {
		type: string;
		label: string;
		placeholder: string;
		required: boolean;
	};
	onChange: (e: any) => void;
}

export default function Array({ key, name, schema, label, value, help, onChange }: ArrayProps) {
	const [values, setValues] = useState<string[]>(value || []);

	const add = () => {
		setValues([...values, '']);
	};
	
	const change = (i: number, value: string) => {
		values[i] = value;
		setValues(values);
	};

	const remove = (i: number) => {
		values.splice(i, 1)
		setValues([...values]);
	};

	useEffect(() => {
		onChange(values);
	}, [values]);

	return (<>
		<div class="mb-3" key={key}>
			<div class="row">
				<div class="col-10">
					<label for={`input-${name}`} class="form-label">{label}</label>
				</div>
				<div class="col-2">
					<button
						type="button"
						class="btn btn-primary"
						onClick={add}
					>
						<i class="fa-solid fa-circle-plus"></i>
					</button>
				</div>
			</div>
			{help && <div id={`${name}Help`} class="form-text">{help}</div>}
			<table class="table">
				<thead>
					<tr>
						<th>
							<div class="row">
								<div class="col-12">
									{schema.label}
								</div>
							</div>
						</th>
					</tr>
				</thead>
				<tbody>
					{ values.map((v, i) => (
							<tr>
								<td>
									<div class="row">
										<div class="col-10">
											{ [
												'text', 'date', 'url', 'email', 'number'
											].indexOf(schema.type) > -1 &&
												<Text
													key={`${i}`}
													type={schema.type}
													name={`${name}[${i}]`}
													placeholder={schema.placeholder}
													required={schema.required}
													value={v as string}
													onChange={(e) => change(i, e.target.value)}
												/>
											}
										</div>
										<div class="col-2">
											<button
												type="button"
												class="btn btn-danger"
												onClick={() => remove(i)}
											>
												<i class="fa-solid fa-circle-minus"></i>
											</button>
										</div>
									</div>
								</td>
							</tr>
						))
					}
				</tbody>
			</table>
		</div>
	</>);
}
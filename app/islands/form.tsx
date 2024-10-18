import Checkbox from "./form/checkbox";
import Radio from "./form/radio";
import Select from "./form/select";
import Submit from "./form/submit";
import Text from "./form/text";
import TextArea from "./form/textarea";

interface FormParams {
	schema: any[];
	data: Parse.Object;
	onSubmit: (data: any) => void;
};
export default function Form({ schema, data, onSubmit}: FormParams) {
	return (
		<>
			<form onSubmit={onSubmit}>
				{schema.map(field => {
					switch (field.type) {
						case 'text':
							return (<Text
								key={field.name}
								type={field.type}
								name={field.name}
								label={field.label}
								placeholder={field.placeholder}
								required={field.required}
								value={data.get(field.name)}
								help={field.help}
								onChange={(e: any) => {
									data.set(field.name, e.target.value);
								}}
							/>)
						case 'textarea':
								return (<TextArea
									key={field.name}
									name={field.name}
									label={field.label}
									placeholder={field.placeholder}
									required={field.required}
									value={data.get(field.name)}
									row={field.row}
									help={field.help}
									onChange={(e: any) => {
										data.set(field.name, e.target.value);
									}}
								/>);
							case 'radio':
								return (<Radio
									name={field.name}
									options={field.options}
									label={field.label}
									value={data.get(field.name)}
									required={field.required}
									onChange={(e: any) => {
										const value = e.target.value === 'true'
											? true : (e.target.value === 'false' ? false : e.target.value);
										data.set(field.name, value);
									}}
								/>);
							case 'checkbox':
								return (<Checkbox
									name={field.name}
									label={field.label}
									options={field.options}
									value={data.get(field.name)}
									required={field.required}
									onChange={(e: any) => {
										const value = e.target.value === 'true'
											? true : (e.target.value === 'false' ? false : e.target.value);
										data.set(field.name, value);
									}}
								/>);
							case 'select':
								return (<Select
									key={field.name}
									type={field.type}
									name={field.name}
									label={field.label}
									options={field.options}
									placeholder={field.placeholder}
									required={field.required}
									value={data.get(field.name)}
									help={field.help}
									onChange={(e: any) => {
										data.set(field.name, e.target.value);
									}}
								/>);
							case 'submit':
								return (
									<Submit
										type={field.type}
										label={field.label}
										onClick={onSubmit}
									/>
								)
					}
				})}
			</form>
		</>
	);
}
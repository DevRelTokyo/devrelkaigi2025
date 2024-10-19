import Checkbox from "./checkbox";
import Radio from "./radio";
import Select from "./select";
import Submit from "./submit";
import Text from "./text";
import TextArea from "./textarea";
import File from "./file";
import Array from "./array";

interface FormParams {
	schema: any[];
	data?: Parse.Object;
	onSubmit: (data: any) => void;
	status?: string;
};
export default function Form({ schema, data, onSubmit, status}: FormParams) {
	if (!data) {
		return (<>Loading...</>);
	}
	return (
		<>
			<form onSubmit={onSubmit}>
				{schema.map(field => {
					switch (field.type) {
						case 'text':
						case 'url':
						case 'email':
						case 'password':
						case 'number':
						case 'date':
						case 'time':
						case 'datetime-local':
							return (<Text
								key={field.name}
								type={field.type}
								name={field.name}
								label={field.label}
								placeholder={field.placeholder}
								required={field.required}
								readOnly={field.readOnly}
								value={data.get(field.name)}
								status={status}
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
									status={status}
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
								status={status}
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
								status={status}
								onChange={(e: any) => {
									const value = e.target.value === 'true'
										? true : (e.target.value === 'false' ? false : e.target.value);
									console.log({ name: field.name, value });
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
								status={status}
								help={field.help}
								onChange={(e: any) => {
									data.set(field.name, e.target.value);
								}}
							/>);
						case 'file':
							return (<File
								key={field.name}
								name={field.name}
								label={field.label}
								help={field.help}
								accept={field.accept}
								value={data.get(field.name)}
								preview={field.preview}
								required={field.required}
								status={status}
								message={field.message}
								onChange={(value) => {
									console.log({ name: field.name, value });
									data.set(field.name, value);
								}}
							/>);
						case 'submit':
							return (
								<Submit
									type={field.type}
									label={field.label}
									status={status}
									onClick={onSubmit}
								/>
							);
						case 'array':
							return (
								<Array
									key={field.name}
									name={field.name}
									label={field.label}
									value={data.get(field.name)}
									help={field.help}
									status={status}
									schema={field.schema}
									onChange={(value: any) => {
										data.set(field.name, value);
									}}
								/>
							);
						}
				})}
			</form>
		</>
	);
}
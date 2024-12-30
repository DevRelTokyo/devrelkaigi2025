import Checkbox from "./checkbox";
import Radio from "./radio";
import Select from "./select";
import Submit from "./submit";
import Text from "./text";
import TextArea from "./textarea";
import File from "./file";
import Array from "./array";
import type { Parse as ParseType } from "~/parse";

import { Parse } from "~/parse";
import { Schema } from "~/types/schema";
import { FormEvent, useState } from "react";

interface FormParams {
	schema: Schema[];
	data?: Parse.Object;
	onSubmit: (data: ParseType.Object) => void;
	status?: string;
}
type FieldValue = string | boolean | number | string[] | {[key: string]: string} | undefined;
export default function Form({ schema, data, onSubmit, status}: FormParams) {
	const [obj, setObj] = useState<{[key: string]: FieldValue}>(data!.toJSON());
	if (!data) {
		return (<>Loading...</>);
	}
	if (typeof window === 'undefined') {
		return (<></>);
	}

	const submit = (e: FormEvent) => {
		e.preventDefault();
		onSubmit(data);
	}
	return (
		<>
			<form onSubmit={submit}>
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
								placeholder={field.placeholder!}
								required={field.required!}
								readOnly={field.readOnly}
								value={obj[field.name] as string}
								status={status}
								help={field.help}
								onChange={(value: string) => {
									data.set(field.name, value);
									setObj({ ...obj, [field.name]: value });
								}}
							/>)
						case 'textarea':
							return (<TextArea
								key={field.name}
								name={field.name}
								label={field.label}
								placeholder={field.placeholder!}
								required={field.required!}
								value={obj[field.name] as string}
								row={field.row}
								status={status}
								help={field.help}
								onChange={(value: string) => {
									data.set(field.name, value);
									setObj({ ...obj, [field.name]: value });
								}}
							/>);
						case 'radio':
							return (<Radio
								name={field.name}
								options={field.options!}
								label={field.label}
								value={obj[field.name] as string}
								status={status}
								required={field.required!}
								onChange={(value: string | boolean) => {
									data.set(field.name, value);
									setObj({ ...obj, [field.name]: value });
								}}
							/>);
						case 'checkbox':
							return (<Checkbox
								name={field.name}
								label={field.label}
								options={field.options!}
								value={obj[field.name] as string}
								required={field.required!}
								status={status}
								onChange={(value: string | boolean) => {
									data.set(field.name, value);
									setObj({ ...obj, [field.name]: value });
								}}
							/>);
						case 'select':
							return (<Select
								key={field.name}
								type={field.type}
								name={field.name}
								label={field.label}
								options={field.options!}
								placeholder={field.placeholder!}
								required={field.required!}
								value={obj[field.name] as string}
								status={status}
								help={field.help}
								onChange={(value: string) => {
									data.set(field.name, value);
									setObj({ ...obj, [field.name]: value });
								}}
							/>);
						case 'file':
							return (<File
								key={field.name}
								name={field.name}
								label={field.label}
								help={field.help}
								accept={field.accept}
								value={obj[field.name] as Parse.File}
								preview={field.preview}
								required={field.required!}
								status={status}
								message={field.message}
								onChange={(value: Parse.File) => {
									data.set(field.name, value);
									setObj({ ...obj, [field.name]: value });
								}}
							/>);
						case 'submit':
							return (
								<Submit
									key={field.name}
									type={field.type}
									label={field.label}
									status={status}
									onClick={submit}
								/>
							);
						case 'array':
							return (
								<Array
									key={field.name}
									name={field.name}
									label={field.label}
									value={obj[field.name] as string[]}
									help={field.help}
									status={status}
									schema={field.schema!}
									onChange={(value: string[]) => {
										data.set(field.name, value);
										setObj({ ...obj, [field.name]: value });
									}}
								/>
							);
						}
				})}
			</form>
		</>
	);
}
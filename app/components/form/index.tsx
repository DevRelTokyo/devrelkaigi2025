import Checkbox from "./checkbox";
import Radio from "./radio";
import Select from "./select";
import Submit from "./submit";
import Text from "./text";
import TextArea from "./textarea";
import TextAreaDrop from "./textareaDrop";
import File from "./file";
import ArrayField from "./arrayField";
import { ParseContext } from "~/contexts/parse";
import { Schema } from "~/types/schema";
import { FormEvent, useContext, useState } from "react";
import { setLang } from "~/utils/i18n";
import { useParams } from "@remix-run/react";
import Message, { MessageProps } from "../message";

interface FormParams {
	schema: Schema[];
	data?: Parse.Object;
	name: string;
	onSubmit: (data: Parse.Object) => void;
	status?: string;
}

type FieldValue = string | boolean | number | string[] | {[key: string]: string} | undefined;
export default function Form({ schema, name, data, onSubmit, status}: FormParams) {
	const { Parse } = useContext(ParseContext)!;
	const [obj, setObj] = useState<{[key: string]: FieldValue}>(data?.toJSON() || {});
	const [message, setMessage] = useState<MessageProps | undefined>(undefined);
  const params = useParams();
  const { locale } = params;
  const { t } = setLang(locale!);
	
	if (!data) {
		return (<>Loading...</>);
	}
	if (typeof window === 'undefined') {
		return (<></>);
	}

	const validate = async () => {
		const errors: string[] = [];
		for (const field of schema) {
			if (field.required && !data!.get(field.name)) {
				errors.push(t('__label__ is required').replace('__label__', field.label));
			}
			if (field.type === 'array') {
				const values = (data!.get(field.name!) as string[]) || [];
				values.filter(v => v === '').length > 0 && 
					errors.push(t('__sub_label__ of __label__ is required')
						.replace('__label__', field.label)
						.replace('__sub_label__', field.schema!.label)
					);
			}
			const value = data!.get(field.name!);
			if (field.pattern && value) {
				const re = new RegExp(field.pattern);
				if (!re.test(data!.get(field.name))) {
					errors.push(t('__label__ is invalid').replace('__label__', field.label));
				}
			}
			if (field.ignores && value) {
				if (field.ignores.indexOf(data!.get(field.name)) >= 0) {
					errors.push(t('__label__ is invalid').replace('__label__', field.label));
				}
			}
			if (field.unique && value) {
				const query = new Parse.Query(name);
				query.equalTo(field.name, value);
				query.equalTo('lang', locale);
				if (field.groupBy) {
					field.groupBy.forEach(key => {
						query.equalTo(key, data!.get(key));
					});
				}
				const res = await query.first();
				if (res && res.id !== data!.id) {
					errors.push(t(`${field.label} is already taken`));
				}
			}
		}
		return errors;
	}

	const convert = () => {
		for (const field of schema) {
			if (field.type === 'datetime-local' && data.get(field.name)) {
				data.set(field.name, new Date(data.get(field.name)));
			}
		}
	}

	const submit = async (e: FormEvent) => {
		e.preventDefault();
		const errors = await validate();
		if (errors.length > 0) {
			setMessage({ messages: errors, type: 'danger' });
			setTimeout(() => {
				setMessage(undefined);
			}, 3000);
		} else {
			convert();
			onSubmit(data);
		}
	}

	return (
		<>
			{ data && 
				<>
					<Message message={message} />
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
									case 'textarea_drop':
										return (<TextAreaDrop
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
											onChange={(value: boolean) => {
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
											onChange={(value: boolean) => {
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
											url={field.url}
											help={field.help}
											accept={field.accept}
											value={obj[field.name] as unknown as Parse.File}
											preview={field.preview}
											required={field.required!}
											status={status}
											message={field.message}
											onChange={(value: Parse.File) => {
												data.set(field.name, value);
												setObj({ ...obj, [field.name]: value as unknown as FieldValue });
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
											<ArrayField
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
			}
		</>
	);
}
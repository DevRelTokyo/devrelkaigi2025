import { CSSProperties, useState } from "react";
import Parse from "parse";

interface FileProps {
	key: string
	name: string;
	label: string;
	help?: string;
	accept?: string;
	value: Parse.File | undefined;
	preview?: boolean;
	required: boolean;
	status?: string;
	message?: string;
	onChange: (e: Parse.File) => void;
}

export default function File({ key, name, accept, label, value, message, preview, help, onChange }: FileProps) {
	const defaultStyle: CSSProperties = {
		border: '3px dotted #555',
		display: 'table-cell',
		verticalAlign: 'middle',
		textAlign: 'center',
	};
	const [style, setStyle] = useState<CSSProperties>(defaultStyle);
	const [file, setFile] = useState<File | undefined>(undefined);
	const [messageText, setMessageText] = useState<string>(message!);

	const onDragover = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setStyle({
			...style,
			backgroundColor: '#f0f0f0',
			border: '5px dotted #333',
		});
	};

	const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		const file = e.dataTransfer?.files[0];
		if (accept && !file?.type.match(accept)) {
			setMessageText('Invalid file type');
			setStyle({
				...style,
				backgroundColor: '#f0f0f0',
				border: '5px dotted #f00',
			});
			setInterval(() => {
				setMessageText(message!);
				setStyle(defaultStyle);
			}, 3000);

			return;
		}
		setFile(file);
		onChange(new Parse.File(file?.name, file));
	};

	const onDragleave = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setStyle({
			...style,
			backgroundColor: '',
			border: '3px dotted #555',
		});
	};

	return (<>
		<div className="mb-3" key={key}>
			<label htmlFor={`input-${name}`} className="form-label">{label}</label>
			{ preview ?
			(
				<div className="row">
					<div className="col-6"
						style={{
							height: '300px',
							display: 'table',
						}}
					>
						<div style={style}
							onDragOver={onDragover}
							onDragLeave={onDragleave}
							onDrop={onDrop}
						>
							{messageText}
						</div>
					</div>
					<div className="col-6" style={{
						textAlign: 'center',
					}}>
						{file ? (<>
							<img
								src={URL.createObjectURL(file)}
								className="img-fluid"
								alt=""
								width={300}
								height={300}
							/>
						</>) : (
							<img
								src={`${value ? value.url : "/assets/images/icon/user_preview.png"}`}
								className="img-fluid"
								alt=""
								width={300}
								height={300}
							/>
						)}
					</div>
				</div>
			)
			: (<>
				<div></div>
			</>)
			}
			{help && <div id={`${name}Help`} className="form-text">{help}</div>}
		</div>
	</>);
}
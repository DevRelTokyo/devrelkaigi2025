import { JSX, useState } from "hono/jsx";
import { Parse } from "../../parse";

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
	onChange: (e: any) => void;
}

export default function File({ key, name, label, required, value, message, preview, accept, help, onChange }: FileProps) {
	const [style, setStyle] = useState<JSX.CSSProperties>({
		border: '3px dotted #555',
		display: 'table-cell',
		verticalAlign: 'middle',
		textAlign: 'center',
	});
	const [file, setFile] = useState<File | undefined>(undefined);

	const onDragover = (e: any) => {
		e.preventDefault();
		setStyle({
			...style,
			backgroundColor: '#f0f0f0',
			border: '5px dotted #333',
		});
	};

	const onDrop = (e: any) => {
		e.preventDefault();
		const file = e.dataTransfer.files[0];
		setFile(file);
		onChange(new Parse.File(file.name, file));
	};

	const onDragleave = (e: any) => {
		e.preventDefault();
		setStyle({
			...style,
			backgroundColor: '',
			border: '3px dotted #555',
		});
	};

	return (<>
		<div class="mb-3" key={key}>
			<label for={`input-${name}`} class="form-label">{label}</label>
			{ preview ?
			(
				<div class="row">
					<div class="col-6"
						style={{
							height: '300px',
							display: 'table',
						}}
					>
						<div style={style}
							onDragover={onDragover}
							onDragleave={onDragleave}
							onDrop={onDrop}
						>
							{message}
						</div>
					</div>
					<div class="col-6" style={{
						textAlign: 'center',
					}}>
						{file ? (<>
							<img
								src={URL.createObjectURL(file)}
								class="img-fluid"
								alt=""
								width={300}
								height={300}
							/>
						</>) : (
							<img
								src={`${value ? value.url() : "/assets/images/icon/user_preview.png"}`}
								class="img-fluid"
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
			{help && <div id={`${name}Help`} class="form-text">{help}</div>}
		</div>
	</>);
}
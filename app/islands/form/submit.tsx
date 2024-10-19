
enum ButtonType {
	Submit = "submit",
	Reset = "reset",
	Button = "button"
}

interface TextProps {
	type: ButtonType;
	label: string;
	status?: string;
	onClick: (e: any) => void;
}

export default function Submit({ type, label, onClick, status }: TextProps) {
	return (<>
		<button
			type={type}
			disabled={status === 'loading'}
			class="btn btn-primary"
			onClick={onClick}
		>{label}</button>
	</>);
}
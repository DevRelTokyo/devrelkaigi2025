
enum ButtonType {
	Submit = "submit",
	Reset = "reset",
	Button = "button"
}

interface TextProps {
	type: ButtonType;
	label: string;
	onClick: (e: any) => void;
}

export default function Submit({ type, label, onClick }: TextProps) {
	return (<>
		<button
			type={type}
			class="btn btn-primary"
			onClick={onClick}
		>{label}</button>
	</>);
}
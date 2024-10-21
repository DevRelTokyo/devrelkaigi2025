import { useSearchParams } from "@remix-run/react";
import Auth from "~/components/auth";

export default function GitHub() {
	const [searchParams, ] = useSearchParams();
	const code = searchParams.get('code');
	if (!code) {
		throw new Response('Bad Request', { status: 400 });
	}
	return (<Auth
		code={code}
	/>);
}

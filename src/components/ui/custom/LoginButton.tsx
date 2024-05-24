"use client";
import React from "react";
import { Button } from "../button";
import { signIn, signOut, useSession } from "next-auth/react";

const LoginButton = () => {
	const { data: session } = useSession();

	if (session) {
		return <Button onClick={async () => await signOut()}>Logout</Button>;
	} else {
		return (
			<Button onClick={async () => await signIn("spotify")}>
				Spotify Connect
			</Button>
		);
	}
};

export default LoginButton;

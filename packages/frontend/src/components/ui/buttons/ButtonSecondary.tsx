import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

export const ButtonSecondary = (
	props: DetailedHTMLProps<
		ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	>
) => (
	<button
		{...props}
		className="btn py-2 px-3  bg-sky-500 border-2 disabled:bg-gray-500 border-sky-700 text-white"
	>
		{props.children}
	</button>
);

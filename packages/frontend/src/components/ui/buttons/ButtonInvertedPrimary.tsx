import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

export const ButtonInvertedPrimary = (
	props: DetailedHTMLProps<
		ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	>
) => (
	<button
		{...props}
		className="btn  border-2 disabled:bg-gray-500 border-green-700 text-black bg-white"
	>
		{props.children}
	</button>
);

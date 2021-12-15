import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

export const ButtonPrimary = (
	props: DetailedHTMLProps<
		ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	>
) => (
	<button
		{...props}
		className="btn bg-black disabled:bg-gray-500 text-white border-2 border-gray-700"
	>
		{props.children}
	</button>
);

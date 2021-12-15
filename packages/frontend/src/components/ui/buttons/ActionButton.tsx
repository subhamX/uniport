import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

export const ActionButton = (
	props: DetailedHTMLProps<
		ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	>
) => (
	<button
		{...props}
		className="rounded md:py-4 px-6 py-2 uppercase font-bold tracking-wider cursor-pointer bg-black hover:bg-gray-700 w-64 text-white"
	>
		{props.children}
	</button>
);

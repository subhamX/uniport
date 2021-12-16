import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

export const ButtonPrimary = (
	props: DetailedHTMLProps<
		ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	>
) => (
	<button
		{...props}
		className="btn py-2 px-3  bg-black disabled:bg-gray-500 text-white border-2 border-gray-700"
	>
		{props.children}
	</button>
);


export const ButtonPrimarySmall = (
	props: DetailedHTMLProps<
		ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	>
) => (
	<button
		{...props}
		className="btn py-1 px-2  text-sm bg-black disabled:bg-gray-500 text-white border-2 border-gray-700"
	>
		{props.children}
	</button>
);

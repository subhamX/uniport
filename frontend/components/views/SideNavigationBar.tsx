import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useSideNavStore } from '../../global-stores/useSideNavStore';


// Small screen: Fullpage
// Large screen: Sidenav
const SideNavigationBar = () => {

	// this will be pulled from the database
	const authNavItems = [
		{
			label: "Job Profiles",
			relative_url: "/security",
		},
		{
			label: "My Profile",
			relative_url: "/features"
		},
		{
			label: "Notifications",
			relative_url: "/login",
		},
		{
			label: "Interview Schedule",
			relative_url: "/join",
		},
		{
			label: "Job Profiles",
			relative_url: "/security",
		},
		{
			label: "My Profile",
			relative_url: "/features"
		},
		{
			label: "Notifications",
			relative_url: "/login",
		},
		{
			label: "Interview Schedule",
			relative_url: "/join",
		},
		{
			label: "Job Profiles",
			relative_url: "/security",
		},
		{
			label: "My Profile",
			relative_url: "/features"
		},
		{
			label: "Notifications",
			relative_url: "/login",
		},
		{
			label: "Interview Schedule",
			relative_url: "/join",
		},
		{
			label: "Job Profiles",
			relative_url: "/security",
		},
		{
			label: "My Profile",
			relative_url: "/features"
		},
		{
			label: "Notifications",
			relative_url: "/login",
		},
		{
			label: "Interview Schedule",
			relative_url: "/join",
		},
		{
			label: "Job Profiles",
			relative_url: "/security",
		},
		{
			label: "My Profile",
			relative_url: "/features"
		},
		{
			label: "Notifications",
			relative_url: "/login",
		},
		{
			label: "Interview Schedule",
			relative_url: "/join",
		},
	]


	const isSideNavOpen=useSideNavStore(state => state.status)


	return (
		<>
			<div className={`uniport-sidenav text-sm absolute z-30 inset-y-0 left-0 w-52  bg-side-nav-color text-custom-grey overflow-y-scroll max-h-screen rounded-br-md transform  ${isSideNavOpen? null: '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out`}>
				<nav className="my-10">
					<NavItems items={authNavItems} globalStyle='flex items-center mt-1 px-4' activeRoute='/security' />
				</nav>
			</div>
		</>
	)
}

export default SideNavigationBar;



const NavItems = ({ items, globalStyle, activeRoute }) => {
	return (
		<>
			{items.map((e, indx) => {
				return (
					<div key={indx}>
						{/* hover:font-semibold */}
						<Link href={e.relative_url}>
							<div className={`rounded-lg m-2 py-1 px-2 cursor-pointer ${e.style} ${globalStyle}  ${activeRoute===e.relative_url ? 'bg-custom-btn-color-bg-active': 'hover:bg-custom-btn-color-bg-hover'}`}>
								{e.label}
							</div>
						</Link>
					</div>
				)
			})}
		</>
	)
}

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';


// Small screen: Fullpage
// Large screen: Sidenav
const AuthNavbar = () => {

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

	const [isNavbarOpen, setisNavbarOpen] = useState(false);

	const toggleSideNav = () => {
		setisNavbarOpen(!isNavbarOpen);
	}
	return (
		<>
			<div className="bg-nav-color md:h-screen overflow-y-auto sticky top-0 flex md:flex-col justify-between md:justify-start  text-white">
				{/* logo */}
				<Link href='/'>
					<div className='cursor-pointer md:pt-2'>
						<Image src="/logo.svg" height={40} width={150} />
					</div>
				</Link>

				{/* for mobile: full screen nav */}
				{/* for md and above: sidenav */}
				<nav className={`${isNavbarOpen ? 'flex': 'hidden'} md:flex md:mt-8 flex-col justify-between`}>
					<NavItems items={authNavItems} globalStyle='md:text-left font-normal text-sm' />
				</nav>

				<div className='md:hidden btn' onClick={toggleSideNav}>
					<Image src={require('../../assets/images/menu.svg')} width={30} height={40} />
				</div>
			</div>
		</>
	)
}

export default AuthNavbar;



const NavItems = ({ items, globalStyle }) => {
	return (
		<>
			{items.map((e, indx) => {
				return (
					<div key={indx}>
						<Link href={e.relative_url}>
							<div className={`rounded-lg m-2 py-1 px-2 cursor-pointer ${e.style} text-center ${globalStyle}`}>
								{e.label}
							</div>
						</Link>
					</div>
				)
			})}
		</>
	)
}

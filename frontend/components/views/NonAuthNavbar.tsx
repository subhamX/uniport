import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';


const nonAuthNavItems = [
	{
		label: "Security",
		relative_url: "/security"
	},
	{
		label: "Features",
		relative_url: "/features"
	},
	{
		label: "Login",
		relative_url: "/",
		style: 'border border-white'
	},
	{
		label: "Join Now",
		relative_url: "/join",
		style: 'bg-custom-blue-color border border-white hover:text-custom-blue-color hover:bg-white'
	},
]

const NonAuthNavbar = () => {

	const [isNavbarOpen, setisNavbarOpen] = useState(false);

	const toggleSideNav = () => {
		setisNavbarOpen(!isNavbarOpen);
	}
	return (
		<>
			<div className="bg-nav-color px-2 md:px-6 sticky top-0 flex  justify-between items-center text-white">
				{/* logo */}
				<Link href='/' >
					<Image src="/logo.svg" height={40} width={150} />
				</Link>

				<nav className='hidden md:flex items-center justify-between'>
					<NavItems />
				</nav>

				<div className='md:hidden btn' onClick={toggleSideNav}>
					<Image src={require('../../assets/images/menu.svg')} width={30} height={40} />
				</div>
			</div>

			{/* Full Screen Nav */}
			{isNavbarOpen ?
				<nav className='md:hidden h-screen bg-custom-blue-color py-6 px-3 md:px-10 lg:px-12 text-white transition ease-out duration-1000'>
					<NavItems />
				</nav>
				: null}
		</>
	)
}

export default NonAuthNavbar;



const NavItems = () => {
	return (
		<>
			{nonAuthNavItems.map(e => {
				return (
					<Link href={e.relative_url}>
						<div className={`rounded-lg m-2 py-1 px-2 cursor-pointer ${e.style} text-center`}>
							{e.label}
						</div>
					</Link>
				)
			})}
		</>
	)
}

import Link from 'next/link';
import { useSideNavStore } from '../../global-stores/useSideNavStore';


// Small screen: Fullpage
// Large screen: Sidenav
// TODO: This is only for authenticated users (enforce by Layout)
const SideNavigationBar = () => {
	// TODO: this will be pulled from the database
	const authNavItems = [
		{
			label: "Job Profiles",
			relative_url: "/security",
		}
	]

	const isSideNavOpen = useSideNavStore(state => state.status)
	return (
		<>
			<div className={`uniport-sidenav text-sm absolute z-30 inset-y-0 left-0 w-52  bg-side-nav-color text-custom-grey overflow-y-scroll min-h-screen max-h-screen rounded-br-md transform  ${isSideNavOpen ? null : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out`}>
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
						<Link href={e.relative_url}>
							<div className={`rounded-lg m-2 py-1 px-2 cursor-pointer ${e.style} ${globalStyle}  ${activeRoute === e.relative_url ? 'bg-custom-btn-color-bg-active' : 'hover:bg-custom-btn-color-bg-hover'}`}>
								{e.label}
							</div>
						</Link>
					</div>
				)
			})}
		</>
	)
}

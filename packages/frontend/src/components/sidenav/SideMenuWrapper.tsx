
// wrapper for side navbar ui
// Small screen: Fullpage
// Large screen: Sidenav
export const SideMenuWrapper = ({ children, isSideNavOpen }) => {
	return (
		<div className={`uniport-sidenav text-sm absolute z-30 inset-y-0 left-0 w-52  bg-side-nav-color text-custom-grey overflow-y-scroll min-h-screen max-h-screen rounded-br-md transform  ${isSideNavOpen ? null : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out`}>
			<nav className="my-10">
				{children}
			</nav>
		</div>
	);
}

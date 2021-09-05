import { useQuery } from '@apollo/client';
import Link from 'next/link';
import { useState } from 'react';
import { useSideNavStore } from '../../global-stores/useSideNavStore';
import { FETCH_CURRENT_USER } from '../../graphql/FetchCurrentUser';
import { FETCH_SIDE_BAR_ITEMS } from '../../graphql/FetchSideBarItems';
import { CREATE_NEW_CAMPAIGN, MANAGE_CAMP, MANAGE_STUDENT_PROFILE_DEFINITIONS, VIEW_CAMP_ALL_PROFILES, VIEW_CAMP_DASH } from '../../routes-config';
import Router, { useRouter } from 'next/router';



// Small screen: Fullpage
// Large screen: Sidenav
// TODO: This is only for authenticated users.
const SideNavigationBar = () => {
	// TODO: this will be pulled from the database


	const router = useRouter();
	const { camp_id } = router.query;

	// if we are here then we are authenticated
	const { data: user } = useQuery(FETCH_CURRENT_USER);
	const { data, loading } = useQuery(FETCH_SIDE_BAR_ITEMS);

	const accessRole = user.getUserDetails.access_role as string;


	const isSideNavOpen = useSideNavStore(state => state.status)


	if (loading) {
		return (
			<SideMenuWrapper isSideNavOpen={isSideNavOpen}>
				Loading...
			</SideMenuWrapper>
		)
	}

	let campaigns = data.getMyCampaigns; // this is an array
	// const accessRole=user.

	// fetch the nav items
	// common
	// all campaigns


	const campaignRoutes = {
		"ADMIN": [
			{
				label: "All profiles",
				relative_url: VIEW_CAMP_ALL_PROFILES(camp_id as string, accessRole),
			},
		], "STUDENT": [
			{
				label: "Applied Profiles",
				relative_url: "/s/camp/:id/appliedprofiles",
			},
			{
				label: "All profiles",
				relative_url: VIEW_CAMP_ALL_PROFILES(camp_id as string, accessRole),
			},
		]
	}

	// admin
	// invite

	const authNavItems = {
		"ADMIN": [
			{
				label: "My Profile",
				relative_url: "/security",

			},
			{
				label: "Dashboard",
				relative_url: "/a/dash/",
			},
			{
				label: "Manage Student Profile Schema",
				relative_url: MANAGE_STUDENT_PROFILE_DEFINITIONS,
			},
			{
				label: "Students",
				relative_url: "/a/dash/",
			}
		],
		"STUDENT": [
			{
				label: "My Profile",
				relative_url: "/s/profile",
			},
			// if campaign
			// ! For now instead of having a dashboard of camp where we show all [posts] we will current make the all profiles as the standard one

		]
	}



	// Not possible since anyone(except admin) will always join into some campaign


	// campaings are defined
	// TODO: Fix the styling of campaigns
	return (
		<>
			<SideMenuWrapper isSideNavOpen={isSideNavOpen}>
				{/* TODO: FIX IT */}


				<div>
					<div className='py-1 px-3 my-2 mx-1 text-sm uppercase font-bold'>
						Campaigns
					</div>
					<div>
						{campaigns ? campaigns.map((e, indx) => {
							return (
								<div key={indx}>
									<NavItem
										label={e.campaign_name}
										relative_url={accessRole === 'ADMIN' ? MANAGE_CAMP(e.campaign_id) : VIEW_CAMP_DASH(e.campaign_id)}
									/>
								</div>
							)
						}) : null}
						{/* Create new campaign btn */}
						{accessRole === 'ADMIN' ? <NavItem
							label='Create New Campaign'
							relative_url={CREATE_NEW_CAMPAIGN}
						/> : null}

						<hr className='border-t-gray-400' />
					</div>
				</div>

				<NavItems items={[...authNavItems[accessRole], ...(camp_id ? campaignRoutes[accessRole] : [])]} globalStyle='' />
			</SideMenuWrapper>
		</>

	)
}

export default SideNavigationBar;






const SideMenuWrapper = ({ children, isSideNavOpen }) => {
	return (<>
		<div className={`uniport-sidenav text-sm absolute z-30 inset-y-0 left-0 w-52  bg-side-nav-color text-custom-grey overflow-y-scroll min-h-screen max-h-screen rounded-br-md transform  ${isSideNavOpen ? null : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out`}>
			<nav className="my-10">
				{children}
			</nav>
		</div>
	</>);
}

const NavItems = ({ items, globalStyle }) => {
	return (
		<>
			{items.map((e, indx) => {
				return (
					<div key={indx}>
						<NavItem
							relative_url={e.relative_url}
							label={e.label}
						/>
					</div>
				)
			})}
		</>
	)
}


const NavItem = ({ relative_url, label }: { relative_url: string, label: string }) => {
	const activeRoute = Router.pathname;
	// console.log(activeRoute);
	return (
		<Link href={relative_url}>
			<div className={`rounded-lg my-2 mx-1 py-1 px-3 cursor-pointer flex items-center mt-1 ${activeRoute === relative_url ? 'bg-custom-btn-color-bg-active' : 'hover:bg-custom-btn-color-bg-hover'}`}>
				{label}
			</div>
		</Link>
	)
}

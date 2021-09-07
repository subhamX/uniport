import { ADMIN_PRIMARY_DASHBOARD, ALL_COMPANIES_ROUTE, MANAGE_STUDENT_PROFILE_DEFINITIONS } from "../../config/routes-config"
import { NavItems } from "./NavItems"


export const AdditionalOptions = ({ accessRole }) => {
	const genericNavOptions = {
		"ADMIN": [
			{
				label: "My Profile",
				relative_url: "###",

			},
			{
				label: "Dashboard",
				relative_url: ADMIN_PRIMARY_DASHBOARD,
			},
			{
				label: "Manage Companies",
				relative_url: ALL_COMPANIES_ROUTE,
			},
			{
				label: "Manage Student Profile Schema",
				relative_url: MANAGE_STUDENT_PROFILE_DEFINITIONS,
			},
			{
				label: "Enrolled Students",
				relative_url: "###",
			},
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
	return (
		<div>
			<div className='py-1 px-3 my-2 mx-1 text-sm uppercase font-bold'>
				Additional Options
			</div>
			<NavItems items={[...genericNavOptions[accessRole]]} globalStyle='' />
		</div>
	)
}

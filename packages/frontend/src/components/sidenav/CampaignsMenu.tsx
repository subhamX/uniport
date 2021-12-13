import { ADD_A_JOB_PROFILE, CREATE_NEW_CAMPAIGN, MANAGE_CAMP, VIEW_CAMP_ALL_PROFILES, VIEW_CAMP_DASH } from "../../config/routes-config"
import { NavItem, NavItems, sideNavItemStyles } from "./NavItems"

// renders all the campaigns of the user along with the options
export const CampaignsMenu = ({ campaigns, accessRole }) => {
	return (
		<>
			{campaigns ?
				<>
					<div className='py-1 px-3 my-2 mx-1 text-sm uppercase font-bold'>
						Campaigns
					</div>
					{campaigns.length ? campaigns.map((e, indx) => {
						return (
							<div key={indx}>
								<NavItem
									label={e.campaign_name}
									relative_url={accessRole === 'ADMIN' ? MANAGE_CAMP(e._id) : VIEW_CAMP_DASH(e._id)}
								/>
							</div>
						)
					}) : <div className={`${sideNavItemStyles} cursor-default text-gray-400`}>No campaigns found</div>}
					{/* Create new campaign btn */}
					{accessRole === 'ADMIN' ? <NavItem
						label='Create New Campaign'
						relative_url={CREATE_NEW_CAMPAIGN}
					/> : null}
					<hr className='border-t-gray-400' />

				</> : null}
		</>
	)
}

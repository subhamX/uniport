import { Router } from 'express'
import { authenticatedUsersOnly } from 'src/config/auth/authCheckers';


const app = Router();

app.get('/profile/', (req, res) => {
	// only for users who have a student profile
	try {
		authenticatedUsersOnly(req);
		if (req.user?.has_student_profile === false) {
			throw Error("NO ASSOCIATED STUDENT PROFILE");
		}

		// TODO: Edit wala karo for stduent definitions

	} catch (err) {

	}
});


`

What's the flow? -> fone
FOR NOW the role is GLOBAL.
It means if I have a ADMIN. HE/SHE is ADMIN for all campaigns etc
Similarly if I have a student. HE/SHE is student for all campaigns.



Find all campaigns to which I am enrolled to.
Find all campaigns to which I can coordinate.
Find all students for some campaign.

SHALL WE HAVE only ADMIN and STUDENT?

WHAT ABOUT POSTS for a specific campaign?




Nav options:
1. (all campaigns) [All users] including admin [TOP LEFT Dropdown]
whatever be it be. We will store in localstorage


on clicking on any campaigns will lead to fetching of all job profiles

2. my profile [For users who have student profile assocated] "/s/profile/"


3. Applied profiles [For users who have student profile assocaited] (since without it you cannot apply)


4. Home

5. Stats [Only admin]; With a few bar graphs

6. invite users [only admin] "/a/invite"

7.


create job profile [
	admin, -> invite new users, create new campaigns, pay money. :) ,
	placement_rep,

	coordinator ->
		all things which student can do
		create job profiles for the campaigns

	student ->
		view his/her own profile,
		edit his/her own profile,
		see the campaigns he/she is registered,
		apply to job profiles in which he/she is eligible,
		see all job profiles of a campaign
		see all posts on the campaign board

]


ADMIN and STUDENT only!!!!

ADMIN doesn't have any student_profile

Isn't accessRole campaign dependent?

adminOps to invite users


for every (org_id,campaign_id,user_id)
CREATE_NEW_JOB
VERIFY_STUDENT
INVITE_NEW_USERS



`


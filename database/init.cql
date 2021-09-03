-- to store the menu items for an access role
-- note: It won't have /s/profile/ in it. We shall see in frontend if [has_student_profile] is true or false.
-- based on which we shall show that
-- NOTE: we are not denomalizing for now. It can be done in future.
CREATE TABLE navigation_menu_item (
	access_role TEXT,
	items set<frozen<navigation_menu_item_type>>,
	PRIMARY KEY((access_role))
);

-- to store the user minimal data to allow authentication
-- query: login a user. (get a user with a given email address)
-- query: get all the users for a org. () [It will hit multi nodes] [Paginated results only]
CREATE TABLE user (
	user_id UUID,
	first_name TEXT,
	last_name TEXT,
	email_address TEXT,
	hashed_password TEXT,
	org_id UUID,
	access_role TEXT,
	-- for now we have "ADMIN" and "STUDENT"
	refresh_token TEXT,
	has_student_profile boolean,
	PRIMARY KEY((email_address), first_name)
);

-- to store the organization details.
-- TODO: ADD some aggregate fields!
-- query: [in Admin Dash] -> Get me some stats.
CREATE TABLE organization (
	org_name TEXT,
	org_id UUID,
	-- TODO: Some more fields? Maybe logo?
	PRIMARY KEY((org_id))
);

-- to store the student profile definitions
-- TODO:
-- Ensure that the admin make a field named [groups] and add all options like CSE with Minor, Electrical Engineering etc
-- It will enable him/her to filter the students.
-- The admin will at first define all the groups and the [Users] will subscribe to the groups!
-- Add [number_of_offers], [max_ctc_offered], [is_frozen] too.
-- Note: if [is_frozen (Number)] is 1; It means in some of the previous instance the user didn't satisfy the campaign rules(not the job profile rules)
-- Also, this can manually be done by ADMIN!

-- Also, convey that first_name, last_name, registered_email is already part of user!

-- query: give me the student profile definition of my org
-- query: give me the profile definition of some attribute id (while filtering on server we might use it)
CREATE TABLE student_profile_definition (
	org_id UUID,
	attribute_id UUID,
	attribute_type TEXT,
	is_array Boolean, -- defines if we shall take an array
	label TEXT,
	is_blocked Boolean,
	required Boolean,
	options set<TEXT>, -- notice that we only support strings as options
	requiresProof Boolean,
	PRIMARY KEY((org_id), attribute_id)
);



-- table to store the [StudentProfile]
-- every field will be like date_of_birth[0], 12th_education[0], 10th_education etc
-- for array fields we will have work_experience[0], work_experience[1] ... and so on

-- query: give me the student profile of mine (as user is authentited. we can easily get org_id nd user_id)
-- Note: we have put both org_id and user_id as partiton key so that even if an org get's tonns of users it will get evenly distributed.(check the claim)
-- query: give me all users of my org. (while filtering)
CREATE TABLE student_profile(
	user_id UUID,
	org_id UUID,
	date_type_1_map 						map<TEXT, frozen<date_type_1>>,
	number_type_2_map 					map<TEXT, frozen<number_type_2>>,
	single_select_3_type_map 		map<TEXT, frozen<single_select_type_3>>,
	phone_number_type_4_map 		map<TEXT, frozen<phone_number_type_4>>,
	address_type_5_map 					map<TEXT, frozen<address_type_5>>,
	email_type_6_map 						map<TEXT, frozen<email_type_6>>,
	current_course_type_7_map 	map<TEXT, frozen<current_course_type_7>>,
	education_type_8_map 				map<TEXT, frozen<education_type_8>>,
	work_experience_type_9_map 	map<TEXT, frozen<work_experience_type_9>>,
	project_type_10_map 				map<TEXT, frozen<project_type_10>>,
	resume_type_11_map 					map<TEXT, frozen<resume_type_11>>,
	multi_select_type_12_map 		map<TEXT, frozen<multi_select_type_12>>,

	PRIMARY KEY((org_id, user_id))
);


-- these are like global rules.
-- and similar rules can be applied while adding a job_profile
-- query: get me all the campaigns of my org
-- query: get me the details of the campaign by [campaign_id]
CREATE TABLE campaign(
	campaign_id UUID,
	org_id UUID,
	rules set<frozen<filtering_rule>>,
	PRIMARY KEY((org_id, campaign_id))
);



-- query: check if this email is invited
CREATE TABLE invited_user(
	email TEXT,
	org_id UUID,
	joining_token TEXT,
	access_role TEXT,
	PRIMARY KEY(email)
);


-- In this way no two org will share company [Isolation is good :)]
-- query: get all companies of my org
-- query: get the company info for the given company_id (with org_id ofcourse as I am authenticated)
CREATE TABLE company(
	company_id UUID,
	org_id UUID,
	company_name TEXT,
	company_logo TEXT,
	company_reps set<frozen<company_representative_type>>,
	PRIMARY KEY((org_id), company_id)
);


-- job profile
-- query: give me recent job profiles (for my org and the campaign)
-- query: give me detailed info of a job profile (org_id, campaign_id, job_profile_id)
-- query: give me all profiles of the company (using orgid and companyid)
-- how to find if I am eligible or not?
-- Note: In later stage make buckets with date_added (a new field). To balance things.
CREATE TABLE job_profile(
	job_profile_id TIMEUUID,
	company_id UUID, -- We can do denormalization here and copy the data. But we won't for now. :)
	org_id UUID,
	campaign_id UUID,
	-- enter annual CTC only
	stipend_low DOUBLE,
	stipend_high DOUBLE,
	stipend_breakdown TEXT,
	profile_description TEXT,
	filters set<frozen<filtering_rule>>,
	deadline TIMESTAMP,
	created_by TEXT,
	created_at TIMESTAMP,
	-- shall be computed by the server
	primary_eligible_candidates set<UUID>,

	PRIMARY KEY((org_id),job_profile_id)
);


-- applied candidates
-- query: get all candidates who have applied for a jobid
-- query: get all jobs which I(as candidate) has applied (in decending order)
CREATE TABLE applied_candidate(
	org_id UUID,
	job_profile_id TIMEUUID,
	candidate_id UUID,
	applied_resume_link TEXT,

	PRIMARY KEY ((org_id),job_profile_id,candidate_id)
);

-- for sessions
CREATE TABLE IF NOT EXISTS sessions (
   sid text,
   session text,
   expires timestamp,
   PRIMARY KEY(sid)
);

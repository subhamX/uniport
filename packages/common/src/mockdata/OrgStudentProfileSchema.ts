// Lists all the form field types we support

import { OrgSchemaInstanceBlock } from "../";

// ! DEPRECATED

// every org will have a different schema
// it gives us additional meta information like valid choices etc

// TODO: Should I also denote the section? Like About, Contact Details etc? :::: For Now NOOOO! We already have some demarcation because of LEGOs. Will see in future. :)
export const orgStudentProfileSchema: {
	[key: string]: OrgSchemaInstanceBlock
} = {
	// TODO: First Name, Last Name, Email Address, Groups are part of User Profile
	"date_of_birth": {
		"label": "Date of Birth",
		"is_blocked": true,
		"attribute_type": "date_type_1",
		"required": true,
		"requires_proof": true,
		"is_array": false,
	},
	"favorite_number": {
		"label": "Favorite Number",
		"is_blocked": true,
		"attribute_type": "number_type_2",
		"required": true,
		"requires_proof": true,
		"is_array": false,
	},
	"gender": {
		"label": "Gender",
		"is_blocked": true,
		"attribute_type": "single_select_type_3",
		"required": true,
		"options": ["Male", "Female", "Others"],
		"requires_proof": true,
		"is_array": false, // IMP note on multi select: even if I make it [true]. Then too I cannot have multi_select_type. Since the storing logic isn't defined in backend
		// So it's better to make a new LEGO multi_select_type.

	},
	"contact_number": {
		"label": "Contact Number",
		"is_blocked": false,
		"required": true,
		"attribute_type": "phone_number_type_4",
		"requires_proof": true,

	},
	"personal_email_address": {
		"label": "Personal Email Address",
		"is_blocked": true,
		"required": true,
		"attribute_type": "email_type_6",
		"requires_proof": true,

	},
	"permanent_address": {
		"label": "Permanent Address",
		"is_blocked": false,
		"required": true,
		"attribute_type": "address_type_5",
		"requires_proof": true,

	},
	"current_address": {
		"label": "Current Address",
		"is_blocked": false,
		"required": true,
		"requires_proof": true,
		"attribute_type": "address_type_5"
	},
	"guardian_phone_number": {
		"label": "Guardian Phone Number",
		"is_blocked": false,
		"required": true,
		"requires_proof": true,
		"attribute_type": "phone_number_type_4"
	},
	"current_course_details": {
		"label": "Current Course Details",
		"is_blocked": false,
		"required": true,
		"requires_proof": true,
		"attribute_type": "current_course_type_7"
	},
	"class_12th": {
		"label": "Class 12th Details",
		"is_blocked": false,
		"required": true,
		"requires_proof": true,

		"attribute_type": "education_type_8"
	},
	"class_10th": {
		"label": "Class 10th Details",
		"is_blocked": false,
		"required": true,
		"requires_proof": true,

		"attribute_type": "education_type_8"
	},
	"work_experience": {
		"label": "Work Experience",
		"is_blocked": false,
		"attribute_type": "work_experience_type_9",
		"required": false,
		"requires_proof": true,

		"is_array": true,
	},
	// "technical_skills": {
	//     "label": "Technical Skills"
	// }
	"project": {
		"label": "Projects",
		"is_array": true,
		"required": false,
		"is_blocked": false,
		"requires_proof": true,

		"attribute_type": "project_type_10"
	},
	"resume": {
		"label": "Resume",
		"required": true,
		"attribute_type": "resume_type_11",
		"requires_proof": true,
		"is_blocked": false,
		"is_array": true
	}

	// "skills": {
	//     label: "skills",
	//     is_blocked: false,

	// }
}


// type FormFieldTypes =
//     "Date" |
//     "SingleSelect" |
//     "PhoneNumber" |
//     "Address" |
//     "Email" |
//     "CurrentEducation" |
//     "EducationTypeA" |
//     "WorkExperience" |
//     "Project" |
//     "File" |
//     "Number";








// attributeId is the uuid
// type StudentProfileDataPointValue =
//     Date | // Date of Birth
//     string | // SingleSelect, PhoneNumber, Email
//     Address; // Address


// type StudentProfileData = {
//     [key: string]: StudentProfileDataPoint
// }

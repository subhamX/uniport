// Lists all the form field types we support

import { OrgSchemaInstanceBlock } from "../";


// every org will have a different schema
// it gives us additional meta information like valid choices etc

// TODO: Should I also denote the section? Like About, Contact Details etc?
export const orgStudentProfileSchema: {
	[key: string]: OrgSchemaInstanceBlock
} = {
	// TODO: First Name, Last Name, Email Address, Phone Number, Groups are part of User Profile
	"date_of_birth": {
		"label": "Date of Birth",
		"isBlocked": true,
		"attributeType": "date_type",
		"required": true,
		"requiresProof": true,
		"isArray": false,
	},
	"favorite_number": {
		"label": "Favorite Number",
		"isBlocked": true,
		"attributeType": "number_type",
		"required": true,
		"requiresProof": true,
		"isArray": false,
	},
	"gender": {
		"label": "Gender",
		"isBlocked": true,
		"attributeType": "single_select_type",
		"required": true,
		"options": ["Male", "Female", "Others"],
		"requiresProof": true,
		"isArray": false, // IMP note on multi select: even if I make it [true]. Then too I cannot have multi_select_type. Since the storing logic isn't defined in backend
		// So it's better to make a new LEGO multi_select_type.

	},
	"contact_number": {
		"label": "Contact Number",
		"isBlocked": false,
		"required": true,
		"attributeType": "phone_number_type",
		"requiresProof": true,

	},
	"personal_email_address": {
		"label": "Personal Email Address",
		"isBlocked": true,
		"required": true,
		"attributeType": "email_type",
		"requiresProof": true,

	},
	"permanent_address": {
		"label": "Permanent Address",
		"isBlocked": false,
		"required": true,
		"attributeType": "address_type",
		"requiresProof": true,

	},
	"current_address": {
		"label": "Current Address",
		"isBlocked": false,
		"required": true,
		"requiresProof": true,
		"attributeType": "address_type"
	},
	"guardian_phone_number": {
		"label": "Guardian Phone Number",
		"isBlocked": false,
		"required": true,
		"requiresProof": true,
		"attributeType": "phone_number_type"
	},
	"current_course_details": {
		"label": "Current Course Details",
		"isBlocked": false,
		"required": true,
		"requiresProof": true,
		"attributeType": "current_course_type"
	},
	"class_12th": {
		"label": "Class 12th Details",
		"isBlocked": false,
		"required": true,
		"requiresProof": true,

		"attributeType": "education_type"
	},
	"class_10th": {
		"label": "Class 10th Details",
		"isBlocked": false,
		"required": true,
		"requiresProof": true,

		"attributeType": "education_type"
	},
	"work_experience": {
		"label": "Work Experience",
		"isBlocked": false,
		"attributeType": "work_experience_type",
		"required": false,
		"requiresProof": true,

		"isArray": true,
	},
	// "technical_skills": {
	//     "label": "Technical Skills"
	// }
	"project": {
		"label": "Projects",
		"isArray": true,
		"required": false,
		"isBlocked": false,
		"requiresProof": true,

		"attributeType": "project_type"
	},
	"resume": {
		"label": "Resume",
		"required": true,
		"attributeType": "resume_type",
		"requiresProof": true,
		"isBlocked": false,
		"isArray": true
	}

	// "skills": {
	//     label: "skills",
	//     isBlocked: false,

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

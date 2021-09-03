// Lists all the form field types we support
type FormFieldTypes =
    "Date" |
    "SingleSelect" |
    "PhoneNumber" |
    "Address" |
    "Email" |
    "CurrentEducation" |
    "EducationTypeA" |
    "WorkExperience" |
    "Project" |
    "File" |
    "Number";

// every org will have a different schema
// it gives us additional meta information like valid choices etc

// TODO: Should I also denote the section? Like About, Contact Details etc?
const studentProfileSchemaMeta: {
    [key: string]: {
        attributeType: FormFieldTypes,
        isArray?: Boolean, // defines if we shall take an array
        // [key: string]: any
        "label": string,
        "isBlocked": boolean,
        "required": boolean,
        "options"?: string[] // notice that we only support strings as options
    },
} = {
    // TODO: First Name, Last Name, Email Address, Phone Number, Groups are part of User Profile
    "date_of_birth": {
        "label": "Date of Birth",
        "isBlocked": true,
        "attributeType": "Date",
        "required": true,
    },
    "favorite_number": {
        "label": "Favorite Number",
        "isBlocked": true,
        "attributeType": "Number",
        "required": true,
    },
    "gender": {
        "label": "Gender",
        "isBlocked": true,
        "attributeType": "SingleSelect",
        "required": true,
        "options": ["Male", "Female", "Others"],
    },
    "contact_number": {
        "label": "Contact Number",
        "isBlocked": false,
        "required": true,
        "attributeType": "PhoneNumber",
    },
    "personal_email_address": {
        "label": "Personal Email Address",
        "isBlocked": true,
        "required": true,
        "attributeType": "Email"
    },
    "permanent_address": {
        "label": "Permanent Address",
        "isBlocked": false,
        "required": true,
        "attributeType": "Address"
    },
    "current_address": {
        "label": "Current Address",
        "isBlocked": false,
        "required": true,
        "attributeType": "Address"
    },
    "guardian_phone_number": {
        "label": "Guardian Phone Number",
        "isBlocked": false,
        "required": true,
        "attributeType": "Address"
    },
    "current_course_details": {
        "label": "Current Course Details",
        "isBlocked": false,
        "required": true,
        "attributeType": "CurrentEducation"
    },
    "class_12th": {
        "label": "Class 12th Details",
        "isBlocked": false,
        "required": true,
        "attributeType": "EducationTypeA"
    },
    "class_10th": {
        "label": "Class 10th Details",
        "isBlocked": false,
        "required": true,
        "attributeType": "EducationTypeA"
    },
    "work_experience": {
        "label": "Work Experience",
        "isBlocked": false,
        "attributeType": "WorkExperience",
        "required": false,
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
        "attributeType": "Project"
    },
    "resume": {
        "label": "Resume",
        "required": true,
        "attributeType": "File",
        "isBlocked": false,
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
type StudentProfileDataPointValue =
    Date | // Date of Birth
    string | // SingleSelect, PhoneNumber, Email
    Address; // Address


// type StudentProfileData = {
//     [key: string]: StudentProfileDataPoint
// }

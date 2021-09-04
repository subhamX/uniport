// TODO: Work on single select and multi select


let tmp = {
	"uuid_of_user": {
		blocks: [

		]
	}
}

// editBlock -> edit a block in student profile
// getAllBlocks -> Get the student profile
//* NOTE: We don;t support all block update at once

export const mockStudentProfileData = {
	"date_of_birth": {
		value: '2025-12-07T18:30:00.000Z',
		fileUrl: "Just a testing file",
		verificationInfo:{
			isVerified: true,
			verifiedBy: "Name of Coordinator",
			verifyActionTimestamp: "10/12/2020 22:30",
		}
	},
	"favorite_number": {
		value: 10101,
		isVerified: true,
		verifiedBy: "Name of Coordinator",
		verifyActionTimestamp: "10/12/2020"
	},
	"gender": {
		value: "Male",
		isVerified: true,
		verifiedBy: "Name of Coordinator",
		verifyActionTimestamp: "10/12/2020"
	},
	"contact_number": {
		countryCode: "+91",
		phNumber: "8076795993",
		isVerified: true,
		verifiedBy: "Name of Coordinator",
		verifyActionTimestamp: "10/12/2020"
	},
	"personal_email_address": {
		value: "helloworld@uniport.com",
		isVerified: true,
		verifiedBy: "Name of Coordinator",
		verifyActionTimestamp: "10/12/2020"
	},
	"permanent_address": {
		country: "India",
		pincode: "101010",
		state: "NCT",
		district: "Delhi",
		city: "Delhi",
		address_line: "A secret place. ^_^",
		isVerified: true,
		verifiedBy: "Name of Coordinator",
		verifyActionTimestamp: "10/12/2020"
	},
	"current_address": {
		country: "India",
		pincode: "101010",
		state: "NCT",
		district: "Delhi",
		city: "Delhi",
		address_line: "A secret place.",
		isVerified: true,
		verifiedBy: "Name of Coordinator",
		verifyActionTimestamp: "10/12/2020"
	},


	"guardian_phone_number": {
		countryCode: "+91",
		phNumber: "1234567890",
		isVerified: true,
		verifiedBy: "Name of Coordinator",
		verifyActionTimestamp: "10/12/2020"
	},
	"current_course_details": {
		program: "Bachelors in Technology",
		specialization: "Electrical Engineering",
		courseStartDate: "23/10/2090",
		courseEndDate: "22/10/2091",
		percent_score: 99.6,
		institute_roll: "ROLL101",
		description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
		isVerified: true,
		verifiedBy: "Name of Coordinator",
		verifyActionTimestamp: "10/12/2020"
	},
	"class_12th": {
		school: "Hello World",
		program: "Program World",
		board: "Nice",
		education_type: "Full Time",
		percent_score: 100,
		courseStartDate: "25/01/2001",
		courseEndDate: "26/01/2001",
		isVerified: true,
		verifiedBy: "Name of Coordinator",
		verifyActionTimestamp: "10/12/2020",
		description: "Did something I cannot remember"
	},
	"class_10th": {
		school: "Hello World",
		program: "Program World",
		board: "Nice",
		education_type: "Full Time",
		percent_score: 100,
		courseStartDate: "25/01/2001",
		courseEndDate: "26/01/2001",
		isVerified: true,
		verifiedBy: "Name of Coordinator",
		verifyActionTimestamp: "10/12/2020",
		description: "Did something I cannot remember"
	},
	"work_experience": [
		{
			company_name: "Mic",
			job_title: "Software Developer",
			location: "Remote",
			position_type: "Internship",
			jobStartDate: "25/01/2001",
			jobEndDate: "26/01/2001",
			details: "Did something I cannot remember",

			isVerified: true,
			verifiedBy: "Name of Coordinator",
			verifyActionTimestamp: "10/12/2020",
		},
		{
			company_name: "Mic",
			job_title: "Software Developer",
			location: "Remote",
			position_type: "Internship",
			jobStartDate: "25/01/2001",
			jobEndDate: "26/01/2001",
			details: "Did something I cannot remember",

			isVerified: true,
			verifiedBy: "Name of Coordinator",
			verifyActionTimestamp: "10/12/2020",
		},
		{
			company_name: "Mic",
			job_title: "Software Developer",
			location: "Remote",
			position_type: "Internship",
			jobStartDate: "25/01/2001",
			jobEndDate: "26/01/2001",
			details: "Did something I cannot remember",

			isVerified: true,
			verifiedBy: "Name of Coordinator",
			verifyActionTimestamp: "10/12/2020",
		},
	],
	"project": [
		{
			"projectName": "Train Ticketing",
			"startDate": "29/10/2014",
			"endDate": "12/1/2015",
			"projectUrl": "https://github.com/subhamX/train-ticketing/",
			"description": "- As part of Database System course, designed and built the backend with REST architecture and the database using dynamic SQL techniques, plpgsql procedures, and triggers, for consistency, and faster query execution.",
			isVerified: true,
			verifiedBy: "Name of Coordinator",
			verifyActionTimestamp: "10/12/2020",
			fileUrl: "https://s3.amazon.com",
		}
	],
	"resume": [
		{
			"fileName": "My SDE Resume",
			"fileUrl": "https://cern",
			"isVerified": true,
			"verifiedBy": "Name of Coordinator",
			'verifyActionTimestamp': "10/12/2020",
		}

	]
}

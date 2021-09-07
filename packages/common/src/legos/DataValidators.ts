import * as Yup from 'yup';


// notice file_url is not required.
export const legoDataValidators
	// Uncommenting as any makes all Yup types go away
	// : {
	// 	[key in SupportedLEGOsTypes]: any
	// }
	= {
	// have removeed the file url this; Will integrate it after storing files in amazon s3
	"date_type_1": Yup.object().shape({
		value: Yup.date().required(),
		file_url: Yup.string()
	}),
	"number_type_2": Yup.object().shape({
		file_url: Yup.string(),
		value: Yup.number().required()
	}),
	"single_select_type_3": Yup.object().shape({
		file_url: Yup.string(),
		value: Yup.string().required()

	}),
	"phone_number_type_4": Yup.object().shape({
		file_url: Yup.string(),
		// TODO: Make them only put numbers in string
		country_code: Yup.string().required(),
		ph_number: Yup.string().required()

	}),
	"address_type_5": Yup.object().shape({
		country: Yup.string().required(),
		pincode: Yup.string().required(),
		state: Yup.string().required(),
		district: Yup.string().required(),
		city: Yup.string().required(),
		address_line: Yup.string().required(),
		file_url: Yup.string(),

	}),
	"email_type_6": Yup.object().shape({
		value: Yup.string().required(),
		file_url: Yup.string(),
	}),
	"current_course_type_7": Yup.object().shape({
		program: Yup.string().required(),
		specialization: Yup.string().required(),
		course_start_date: Yup.date().required(),
		course_end_date: Yup.date().required(),
		// is number same as float?
		percent_score: Yup.number().required(),
		institute_roll: Yup.string().required(),
		description: Yup.string().required(),
		file_url: Yup.string(),
	}),
	"education_type_8": Yup.object().shape({
		school: Yup.string().required(),
		program: Yup.string().required(),
		board: Yup.string().required(),
		education_type: Yup.string().required(),
		percent_score: Yup.number().required(),
		course_start_date: Yup.date().required(),
		course_end_date: Yup.date().required(),
		file_url: Yup.string(),
	}),
	"work_experience_type_9": Yup.object().shape({
		company_name: Yup.string().required(),
		job_title: Yup.string().required(),
		location: Yup.string().required(),
		position_type: Yup.string().required(),
		job_start_date: Yup.date().required(),
		job_end_date: Yup.date().required(),
		details: Yup.string().required(),
		file_url: Yup.string(),

	}),
	"project_type_10": Yup.object().shape({
		project_name: Yup.string().required(),
		start_date: Yup.date().required(),
		end_date: Yup.date().required(),
		project_url: Yup.string().required(),
		description: Yup.string().required(),
		file_url: Yup.string(),

	}),
	"resume_type_11": Yup.object().shape({
		file_name: Yup.string().required(),
		file_url: Yup.string().required(),
	}),
	"multi_select_type_12": Yup.object().shape({
		file_url: Yup.string(),
		value: Yup.array().required(),
	}),

}

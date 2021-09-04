import { Router } from 'express'
import { dbClient } from '../db';
import { authenticatedUsersOnly } from '../config/auth/authCheckers';
import { allSupportedLEGOs, SupportedLEGOsTypes } from '@uniport/common';
import { STUDENT_PROFILE_BLOCK_ID_INDEX_DELIM } from '../config/constants';
import * as Yup from 'yup';



const app = Router();


type GenericObject = {
	[key: string]: any
}



// ! [debug_block_type] is redundant. Since block determination is done by student definitions and not by this
const formatLEGOData = (data: GenericObject, debug_block_type: string) => {
	console.log(data);
	if (!data) return {};
	let formattedData: any = {}

	Object.entries(data).forEach(e => {
		let [attribute_id, block_index] = e[0].split(STUDENT_PROFILE_BLOCK_ID_INDEX_DELIM);
		let data = e[1];


		if (!data.verification_info) {
			data.verification_info = {
				is_verified: false,
				verified_by: null,
				verify_action_timestamp: null
			}
		}

		if (!formattedData[attribute_id]) {
			formattedData[attribute_id] = []
		}


		formattedData[attribute_id] = [
			...formattedData[attribute_id],
			{
				block_index: block_index,
				...data,
				debug_block_type
			}
		]
	})

	console.log("RETURN::: ", formattedData)

	return formattedData;
}



type ResumePayload = {
	attribute_type: 'resume_type_11',
	attribute_id: string,
	// if block_indx is not sent then we will assume it to be an add request. We will use some uuid as block_index
	// That numbering approach isn't scalable.
	block_index?: string,
	file_url: string,
	file_name: string,
	// we need this else how will we know when the admin submits an edit request?
	// to keep things uniform we shall ask the student_id from the student too. :)
	student_id: string,
}


type PhoneNumberPayload = {
	attribute_type: 'phone_number_type_4',
	attribute_id: string,
	block_index?: string,
	file_url?: string,
	country_code: string,
	ph_number: string,
	student_id: string,
}




// type Payload = ResumePayload ;
/**
 * Route to add or edit new block to the student profile
 */
app.post('/profile/add/', async (req, res) => {
	try {
		authenticatedUsersOnly(req);
		let payload: any = req.body;

		let canAccessThisRecord = false;

		let user_id = payload.student_id;
		if (req.user?.access_role === 'ADMIN') {
			canAccessThisRecord = true;
		} else if (req.user?.user_id.toString() === user_id) {
			canAccessThisRecord = true;
		}

		console.log(req.user?.user_id);
		console.log(payload);

		if (!canAccessThisRecord) {
			throw new Error("You don't have sufficient permissions to edit this record")
		}

		let attribute_id = payload.attribute_id;
		let block_index = payload.block_index;
		let student_id = payload.student_id;
		let org_id = req.user?.org_id;

		if (!attribute_id || !student_id) {
			throw Error("attribute_id and student_id are mandatory fields");
		}

		let performed_operation;
		if (!block_index) {
			performed_operation = 'ADD_BLOCK';
		} else {
			performed_operation = 'EDIT_BLOCK';
		}

		let attribute_type: SupportedLEGOsTypes = payload.attribute_type;

		const validator = legoValidators[attribute_type];
		if (!validator) {
			throw new Error(`Invalid LEGO type (attribute_type) ${attribute_type}`)
		}
		await validator.validate(payload);

		console.log("VALUDATIOn DONE")

		if (attribute_type === 'resume_type_11') {
			let query = `UPDATE student_profile
			SET resume_type_11_map[?]={file_name: ?, file_url: ?}
			WHERE user_id = ? AND org_id=?`

			let attribute_id_with_block_index = `${attribute_id}${STUDENT_PROFILE_BLOCK_ID_INDEX_DELIM}${block_index}`
			await dbClient.execute(query, [
				attribute_id_with_block_index,
				payload.file_name,
				payload.file_url,
				user_id,
				org_id
			])
		} else if (attribute_type === 'phone_number_type_4') {
			let query = `UPDATE student_profile
			SET phone_number_type_4_map[?]={country_code: ?, ph_number: ?, file_url: ?}
			WHERE user_id = ? AND org_id=?`

			let attribute_id_with_block_index = `${attribute_id}${STUDENT_PROFILE_BLOCK_ID_INDEX_DELIM}${block_index}`
			await dbClient.execute(query, [
				attribute_id_with_block_index,
				payload.country_code,
				payload.ph_number,
				payload.file_url,
				user_id,
				org_id
			])

		} else if (attribute_type === 'email_type_6') {
			let query = `UPDATE student_profile
			SET email_type_6_map[?]={value: ?, file_url: ?}
			WHERE user_id = ? AND org_id=?`

			let attribute_id_with_block_index = `${attribute_id}${STUDENT_PROFILE_BLOCK_ID_INDEX_DELIM}${block_index}`
			await dbClient.execute(query, [
				attribute_id_with_block_index,
				payload.value,
				payload.file_url,
				user_id,
				org_id
			])
		} else if (attribute_type === 'address_type_5') {
			let query = `UPDATE student_profile
			SET address_type_5_map[?]={country: ?, pincode: ?, state: ?, district: ?, city: ?, address_line: ?, file_url:?}
			WHERE user_id = ? AND org_id=?`

			let attribute_id_with_block_index = `${attribute_id}${STUDENT_PROFILE_BLOCK_ID_INDEX_DELIM}${block_index}`
			await dbClient.execute(query, [
				attribute_id_with_block_index,
				payload.country,
				payload.pincode,
				payload.state,
				payload.district,
				payload.city,
				payload.address_line,
				payload.file_url,
				user_id,
				org_id
			])

		} else if (attribute_type === 'education_type_8') {
			let query = `UPDATE student_profile
			SET education_type_8_map[?]={school: ?, program: ?, board: ?, education_type: ?, percent_score: ?, course_start_date: ?, course_end_date:?,  file_url:?}
			WHERE user_id = ? AND org_id=?`

			let attribute_id_with_block_index = `${attribute_id}${STUDENT_PROFILE_BLOCK_ID_INDEX_DELIM}${block_index}`
			await dbClient.execute(query, [
				attribute_id_with_block_index,
				payload.school,
				payload.program,
				payload.board,
				payload.education_type,
				payload.percent_score,
				payload.course_start_date,
				payload.course_end_date,
				payload.file_url,
				user_id,
				org_id
			], { prepare: true })

		} else if (attribute_type === 'project_type_10') {
			let query = `UPDATE student_profile
			SET project_type_10_map[?]={project_name: ?, start_date:?, end_date:?, project_url:?, description:?,  file_url:?}
			WHERE user_id = ? AND org_id=?`

			let attribute_id_with_block_index = `${attribute_id}${STUDENT_PROFILE_BLOCK_ID_INDEX_DELIM}${block_index}`
			await dbClient.execute(query, [
				attribute_id_with_block_index,
				payload.project_name,
				payload.start_date,
				payload.end_date,
				payload.project_url,
				payload.description,
				payload.file_url,
				user_id,
				org_id
			], { prepare: true })

		} else if (attribute_type === 'work_experience_type_9') {
			let query = `UPDATE student_profile
			SET work_experience_type_9_map[?]={company_name:?, job_title:?, location:?, position_type:?,job_start_date:?, job_end_date:?, details:?,  file_url:?}
			WHERE user_id = ? AND org_id=?`

			let attribute_id_with_block_index = `${attribute_id}${STUDENT_PROFILE_BLOCK_ID_INDEX_DELIM}${block_index}`
			await dbClient.execute(query, [
				attribute_id_with_block_index,
				payload.company_name,
				payload.job_title,
				payload.location,
				payload.position_type,
				payload.job_start_date,
				payload.job_end_date,
				payload.details,
				payload.file_url,
				user_id,
				org_id
			], { prepare: true })

		} else {
			throw Error("LEGO type not supported yet")
		}



		return res.send({
			error: false,
			performed_operation
		})


	} catch (err) {
		return res.send({
			error: true,
			message: err.message
		})
	}
})

// notice file_url is not required.

// Yup.addMethod(Yup.string, 'string_integer', function () {
//   return this.matches(/^\d+$/, 'The field should have digits only')
// })

const legoValidators
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

// beneficial while student is adding/deleteing/editing data to profile



// we are keeping this user_id thing so that admin can also see the profiles
// else we just could have tried to get the userid from [req.user] and then send the data
// Since user_id is a surrogate key, so it's actually nice that nobody would mind that on the addressbar (they might if we used email)
app.get('/profile/:user_id', async (req, res) => {
	// only for users who have a student profile
	try {
		authenticatedUsersOnly(req);

		let { user_id } = req.params;

		let canAccessThisRecord = false;
		if (req.user?.access_role === 'ADMIN') {
			canAccessThisRecord = true;
		} else if (req.user?.user_id.toString() === user_id) {
			canAccessThisRecord = true;
		}


		if (!canAccessThisRecord) {
			throw new Error("You don't have sufficient permissions to view this record")
		}

		let org_id = req.user?.org_id;

		// since I have put org_id here. this will ensure that no two tenants can see each other data
		let response = await dbClient.execute(`SELECT * FROM student_profile
		WHERE org_id=? AND user_id=?`, [org_id, user_id]);

		if (response.rowLength !== 1) {
			throw new Error("Profile doesn't exists or you are not authorised");
		}

		let data = response.rows[0];
		console.log(data);

		// type StudentProfileBlock = {
		// 	'org_id': string
		// 	'user_id': string
		// 	'address_type_5_map': GenericObject
		// 	'current_course_type_7_map': GenericObject
		// 	'date_type_1_map': GenericObject
		// 	'education_type_8_map': GenericObject
		// 	'email_type_6_map': GenericObject
		// 	'multi_select_type_12_map': GenericObject
		// 	'number_type_2_map': GenericObject
		// 	'phone_number_type_4_map': GenericObject
		// 	'project_type_10_map': GenericObject
		// 	'resume_type_11_map': GenericObject
		// 	'single_select_3_type_map': GenericObject
		// 	'work_experience_type_9_map': GenericObject
		// }

		let finalResponse = {

		}

		allSupportedLEGOs.forEach(e => {
			let key = `${e}_map`;
			console.log(key);
			let current = formatLEGOData(data[key], e);
			if (current) {
				finalResponse = {
					...finalResponse, ...{
						...current,
					}
				};
			}
		})

		console.log(finalResponse);


		// let finalResponse: StudentProfileBlock = {
		// 	org_id: data.org_id,
		// 	user_id: data.user_id,
		// 	...legoData
		// }



		// TODO: Edit wala karo for stduent definitions?
		// NEXT: What?
		return res.send({
			error: false,
			data: finalResponse
		})
	} catch (err) {
		return res.send({
			error: true,
			message: err.message
		})

	}
});




export default app;

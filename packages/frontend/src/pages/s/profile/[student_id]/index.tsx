
// Page to show the rendered profile of the student in view mode
// Any non-blocked field (by university admin) can be edited using a modal

import HeadMeta from "../../../../components/views/HeadMeta";
import Layout from "../../../../components/views/Layout";
import dayjs from "dayjs";
import { ResumeView } from "../../../../components/profile/Resume/view";
import { useQuery } from "@apollo/client";
import { GET_STUDENT_PROFILE_DEFINITIONS } from "../../../../graphql/GetStudentProfileDefinitions";
import { OrgSchemaInstanceBlock, SupportedLEGOsTypes } from "@uniport/common";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FETCH_STUDENT_PROFILE_DATA_ENDPOINT } from "../../../../config/routes-config";
import { PhoneNumberView } from "../../../../components/profile/PhoneNumber/PhoneNumberBlock";
import { EmailAddressView } from "../../../../components/profile/EmailAddress/EmailAddressBlock";
import { AddressBlock } from "../../../../components/profile/AddressBlock/AddressBlock";
import { EducationBlock } from "../../../../components/profile/EducationTypeA/view";
import { ProjectBlock } from "../../../../components/profile/Project/view";
import { WorkExperienceBlock } from "../../../../components/profile/WorkExperience/view";
import { FETCH_CURRENT_USER } from "../../../../graphql/FetchCurrentUser";





const StudentProfile = () => {
	// fetch from server
	// *Note: The keys of the [studentData] will be same as keys of [studentProfileSchemaMeta]

	let { data, loading, error } = useQuery(GET_STUDENT_PROFILE_DEFINITIONS);

	const { data: user } = useQuery(FETCH_CURRENT_USER);

	console.log(user);


	const [loadingStudentData, setloadingStudentData] = useState(true)
	// const [studentDataFetchError, setStudentData] = useState(true)
	const [studentDataFetchError, setstudentDataFetchError] = useState(null);
	const [studentData, setStudentData] = useState(null);
	const [basicData, setBasicData] = useState(null);
	const router = useRouter()
	let student_id = router.query.student_id as string;

	console.log(student_id);

	useEffect(() => {
		const getStudentProfileDataBlocks = async (student_id) => {
			try {
				console.log("ashasihsa", student_id);
				const url = `${FETCH_STUDENT_PROFILE_DATA_ENDPOINT}/${student_id}`;
				let res = await fetch(url, {
					cache: 'no-cache',
					credentials: 'include',
				})
				let jsonData = await res.json();
				if (jsonData['error']) {
					throw Error(jsonData['message'])
				}
				// TODO: set the data to zustang state
				setStudentData(jsonData['data']);
				setBasicData(jsonData['basic']);

				setloadingStudentData(false);
			} catch (err) {
				setstudentDataFetchError(err.message);
				setloadingStudentData(false);
			}

		}

		if (student_id) {
			getStudentProfileDataBlocks(student_id);
		}

	}, [student_id])



	return (
		<>
			<HeadMeta title='UniPort | Student Profile' />
			<Layout>
				<div className='px-3 max-w-2xl my-10 w-full mx-auto'>
					<div>

						<div className='text-2xl font-bold leading-normal mt-0 mb-3 text-purple-800'>
							Student Profile
						</div>




						{error || studentDataFetchError ?
							<div className='my-3 text-sm text-left text-red-600 bg-red-500 bg-opacity-10 border border-red-400 flex items-center p-4 rounded-md'>
								{error ? error.message : null}
								{error && studentDataFetchError ? <br /> : null}
								{studentDataFetchError ? studentDataFetchError : null}
							</div> : null}
						{loading || loadingStudentData ?
							<div className='my-3 text-sm text-left text-blue-600 bg-blue-500 bg-opacity-10 border border-blue-400 flex items-center p-4 rounded-md'>
								Loading...
							</div> : null}

						{/* render only if there is no loading, no errors */}
						{data && !loadingStudentData && (!error && !studentDataFetchError) && < div >

							<div className="bg-white px-4 py-4 flex my-2 rounded-lg shadow flex-col gap-2">
								<div >
									<h2 className="text-base font-bold text-gray-700 my-0"></h2>
								</div>
								<div className='grid grid-cols-2'>
									<div className='text-sm font-bold mt-2'>
										First Name
									</div>
									<div className='text-gray-500 text-sm mt-2'>
										{basicData.first_name}
									</div>
									<div className='text-sm font-bold mt-2'>
										Last Name
									</div>
									<div className='text-gray-500 text-sm mt-2'>
										{basicData.last_name}
									</div>
									<div className='text-sm font-bold mt-2'>
										Email Address
									</div>
									<div className='text-gray-500 text-sm mt-2'>
										{basicData.email_address}
									</div>
								</div>
							</div>
							<RenderLEGOs
								getStudentProfileDefinitions={data.getStudentProfileDefinitions}
								studentProfileDataBlocks={studentData} />
						</div>}
					</div>
				</div>
			</Layout>
		</>
	)
}



// plural h. XD
const RenderLEGOs = ({ getStudentProfileDefinitions, studentProfileDataBlocks }) => {
	console.log(studentProfileDataBlocks);

	return (
		<div>
			{getStudentProfileDefinitions.map(e => {
				let { attribute_id, attribute_type }: { attribute_id: string, attribute_type: SupportedLEGOsTypes } = e;

				let data = studentProfileDataBlocks[attribute_id] ?? [];

				if (attribute_type === 'resume_type_11') {
					return (
						<ResumeView
							// attribute_id={attribute_id}
							data={data}
							meta={e}
						/>
					)
				} else if (attribute_type === 'phone_number_type_4') {
					return (
						<PhoneNumberView
							data={data}
							meta={e}
						/>
					)
				} else if (attribute_type === 'email_type_6') {
					return (
						<EmailAddressView
							data={data}
							meta={e}
						/>
					)
				} else if (attribute_type === 'address_type_5') {
					return (
						<AddressBlock
							data={data}
							meta={e}
						/>
					)
				} else if (attribute_type === 'education_type_8') {
					return (
						<EducationBlock
							data={data}
							meta={e}
						/>
					)
				} else if (attribute_type === 'project_type_10') {
					return (
						<ProjectBlock
							data={data}
							meta={e}
						/>
					)
				} else if (attribute_type === 'work_experience_type_9') {
					return (
						<WorkExperienceBlock
							data={data}
							meta={e}
						/>
					)
				}
				return null;
			})}
		</div>
	)
}


export default StudentProfile;

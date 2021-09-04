
// Page to show the rendered profile of the student in view mode
// Any non-blocked field (by university admin) can be edited using a modal

import { orgStudentProfileSchema, mockStudentProfileData, OrgSchemaInstanceBlock } from "../../../../common/dist";
import HeadMeta from "../../../components/views/HeadMeta";
import Layout from "../../../components/views/Layout";
import { GenericKeyValueView } from "../../../components/profile/GenericKeyValue/view";
import dayjs from "dayjs";
import { CurrentCourseView } from "../../../components/profile/CurrentCourse/view";
import { EducationTypeA } from "../../../components/profile/EducationTypeA/view";
import { WorkExperienceView } from "../../../components/profile/WorkExperience/view";
import { ProjectView } from "../../../components/profile/Project/view";
import { ResumeView } from "../../../components/profile/Resume/view";


const StudentProfile = () => {
	// fetch from server
	// *Note: The keys of the [studentData] will be same as keys of [studentProfileSchemaMeta]


	return (
		<>
			<HeadMeta title='UniPort | Student Profile' />
			<Layout>
				<div className='px-3 max-w-2xl my-10 w-full mx-auto'>
					<div>
						{/* add edit option based on isBLocked */}
						{/* The edit component will be part of the view only */}
						{Object.entries(orgStudentProfileSchema).map(e => {
							let fieldId = e[0];
							let fieldMetaData: OrgSchemaInstanceBlock = e[1];

							let blockMetaInfo: BlockMetaInfoInterface = {
								fieldId,
								fieldMetaData
							}

							if (e[1].isArray) {
								let items = mockStudentProfileData[fieldId];
								// blockMetaInfo.elementIndex will be defined for array blocks
								return (
									<div>
										{items && items.length ? items.map((data: any, indx: number) => {
											return (
												<RenderLEGO
													key={`${fieldId}##${indx}`}
													blockMetaInfo={{ ...blockMetaInfo, elementIndex: indx + 1 }}
													blockData={data}
												/>
											)
										}) :
											(<div key={fieldId} className='text-sm'>
												<div className='font-medium'>
													{fieldMetaData.label}
												</div>
												<div className='flex justify-between'>
													<div className='text-sm'>
														No items found.
													</div>
													<div className='tag-style text-sm bg-purple-300  text-purple-700'>Add now</div>
												</div>
											</div>
											)
										}
									</div>
								)
							} else {
								// blockMetaInfo.elementIndex will be undefined for single blocks
								return (
									<div key={fieldId}>
										{mockStudentProfileData[fieldId] ?
											<RenderLEGO
												key={fieldId}
												blockMetaInfo={blockMetaInfo}
												blockData={mockStudentProfileData[fieldId]}
											/>
											:
											<div>
												{fieldId}: Want to add one?
											</div>
										}
									</div>
								)
							}
						})}
					</div>
				</div>
			</Layout>
		</>
	)
}



export default StudentProfile;


type BlockMetaInfoInterface = {
	fieldId: string,
	elementIndex?: number, // in a field like projects where there are multiple instances in the same key
	fieldMetaData: OrgSchemaInstanceBlock,
}


const RenderLEGO = ({ blockMetaInfo, blockData }: { blockMetaInfo: BlockMetaInfoInterface, blockData: any }) => {
	let fieldId = blockMetaInfo.fieldId;
	let elementIndex = blockMetaInfo.elementIndex;
	let { isVerified, verifyActionTimestamp, fileUrl } = blockData;
	let { label, isBlocked, required, attributeType, requiresProof } = blockMetaInfo.fieldMetaData;

	if (attributeType === 'DateTypeA'
		|| attributeType === 'Number'
		|| attributeType === 'SingleSelect'
		|| attributeType === 'PhoneNumber'
		|| attributeType === 'Email'
		|| attributeType === 'AddressTypeA') {

		let formattedValue: string;

		if (attributeType == 'DateTypeA') {
			let { value } = blockData;
			formattedValue = dayjs(value).format('DD/MM/YYYY'); // formatted date
		} else if (attributeType === 'Number') {
			formattedValue = blockData.value;
		} else if (attributeType === 'SingleSelect') {
			formattedValue = blockData.value;
		} else if (attributeType === 'PhoneNumber') {
			let { countryCode, phNumber } = blockData;
			formattedValue = `${countryCode}-${phNumber}`;
		} else if (attributeType === 'Email') {
			formattedValue = blockData.value;
		} else if (attributeType === 'AddressTypeA') {
			let { address_line, city, district, state, country, pincode } = blockData;
			formattedValue = `${address_line} ${city} ${district} ${state} ${country} ${pincode}`
		}


		return <GenericKeyValueView
			label={label}
			value={formattedValue}
			isBlocked={isBlocked}
			fieldId={fieldId}
			fileUrl={fileUrl}
			elementIndex={elementIndex}
			isVerified={isVerified}
			requiresProof={requiresProof}
			verifyActionTimestamp={verifyActionTimestamp}
		/>
	} else if (attributeType === 'CurrentCourse') {
		return <CurrentCourseView
			label={label}
			isBlocked={isBlocked}
			fieldId={fieldId}
			elementIndex={elementIndex}

			requiresProof={requiresProof}
			data={blockData}
		/>
	} else if (attributeType === 'EducationTypeA') {
		return (
			<EducationTypeA
				label={label}
				isBlocked={isBlocked}
				fieldId={fieldId}
				elementIndex={elementIndex}

				requiresProof={requiresProof}
				data={blockData}
			/>
		)

	} else if (attributeType === 'WorkExperience') {
		return <WorkExperienceView
			label={label}
			fieldId={fieldId}
			isBlocked={isBlocked}
			elementIndex={elementIndex}

			requiresProof={requiresProof}
			data={blockData}
		/>
	} else if (attributeType === 'Project') {
		return (
			<ProjectView
				data={blockData}
				label={label}
				isBlocked={isBlocked}
				fieldId={fieldId}
				elementIndex={elementIndex}
				requiresProof={requiresProof}
			/>
		);
	} else if (attributeType === 'Resume') {
		return (
			<ResumeView
				label={label}
				fieldId={fieldId}
				elementIndex={elementIndex}
				isBlocked={isBlocked}
				data={blockData}
				requiresProof={required}
			/>
		)
	} else {
		return (
			<div>
				{JSON.stringify(blockMetaInfo)}
				{JSON.stringify(blockData)}
			</div>
		)
	}
}

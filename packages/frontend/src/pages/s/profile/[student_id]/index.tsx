
// Page to show the rendered profile of the student in view mode
// Any non-blocked field (by university admin) can be edited using a modal

import HeadMeta from "../../../../components/HeadMeta/HeadMeta";
import Layout from "../../../../components/AuthLayout/Layout";
import { useQuery } from "@apollo/client";
import { GET_STUDENT_PROFILE_DEFINITIONS } from "../../../../graphql/GetStudentProfileDefinitions";
import { BlockData, StudentProfileDefinition, supportedFieldsDefaultValues } from "@uniport/common";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { GET_STUDENT_PROFILE_BY_ID } from "../../../../graphql/GetStudentProfileById";
import { MutateStudentProfileDataBlockModal } from "../../../../components/StudentProfile/MutateStudentProfileDataBlockModal";
import { ButtonPrimarySmall } from "../../../../components/ui/buttons/ButtonPrimary";
import { VerificationInfoView } from "../../../../components/profile/Utils/VerificationInfoView";
import { StudentProfileBlockDataView } from "../../../../components/StudentProfile/StudentProfileBlockDataView";





const StudentProfile = () => {
	// fetch from server
	// *Note: The keys of the [studentData] will be same as keys of [studentProfileSchemaMeta]
	const router = useRouter()
	let student_id = router.query.student_id as string;


	if (!student_id) return null;

	const { data: studentProfileDefData,
		loading: definitionsLoading,
		error: definitionsError } = useQuery(GET_STUDENT_PROFILE_DEFINITIONS);

	const { data: profileData,
		loading: profileLoading,
		error: profileError } = useQuery(GET_STUDENT_PROFILE_BY_ID, {
			variables: {
				_id: student_id
			}
		});

	// const [loadingStudentData, setloadingStudentData] = useState(true)
	// const [studentDataFetchError, setstudentDataFetchError] = useState(null);

	// const studentProfile = useStudentProfileStore(state => state.studentProfile);
	// const setStudentProfile = useStudentProfileStore(state => state.setStudentProfile);


	return (
		<>
			<HeadMeta title='Uniport | Student Profile' />
			<Layout>
				<div className='px-3 max-w-2xl my-10 w-full mx-auto'>
					<div>


						<div className='heading-text text-2xl font-bold leading-normal mt-0 mb-3 text-purple-800'>
							Student Profile
						</div>


						{definitionsError || profileError ?
							<div className='my-3 text-sm text-left text-red-600 bg-red-500 bg-opacity-10 border border-red-400 flex items-center p-4 rounded-md'>
								{definitionsError ? definitionsError.message : null}
								{definitionsError && profileError ? <br /> : null}
								{profileError ? profileError.message : null}
							</div> : null}
						{definitionsLoading || profileLoading ?
							<div className='my-3 text-sm text-left text-blue-600 bg-blue-500 bg-opacity-10 border border-blue-400 flex items-center p-4 rounded-md'>
								Loading...
							</div> : null}

						{/* render only if there is no loading, no errors */}
						{!profileLoading && !profileError ?

							< div >
								<div className="card-container px-4 py-4 flex my-2 rounded-lg shadow flex-col gap-2">
									<div className='grid grid-cols-2'>
										<div className='text-sm font-bold mt-2'>
											First Name
										</div>
										<div className='text-gray-500 text-sm mt-2'>
											{profileData.getStudentProfileById.first_name}
										</div>
										<div className='text-sm font-bold mt-2'>
											Last Name
										</div>
										<div className='text-gray-500 text-sm mt-2'>
											{profileData.getStudentProfileById.last_name}
										</div>
										<div className='text-sm font-bold mt-2'>
											Email Address
										</div>
										<div className='text-gray-500 text-sm mt-2'>
											{profileData.getStudentProfileById.email_address}
										</div>
									</div>
								</div>
								<RenderStudentProfileBlocks
									// sending studentId to enable them perform queries to server
									studentId={student_id}
									studentProfileDefinitions={studentProfileDefData.getStudentProfileDefinitions}
									studentProfileDataBlocks={profileData.getStudentProfileById.blocks_data} />
							</div>

							: null}
					</div>
				</div>
			</Layout>
		</>
	)
}




/**
 * Here the basic idea is to iterate over all the student profile definition blocks
 * And then try to find all the blocks in student profile corresponding to that block!
 */
const RenderStudentProfileBlocks = ({ studentId, studentProfileDefinitions, studentProfileDataBlocks }: { studentProfileDefinitions: StudentProfileDefinition[], studentProfileDataBlocks: BlockData[], studentId: string }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [initialValues, setInitialValues] = useState({});
	const [dataBlockId, setDataBlockId] = useState(null);
	const [modalDefinitionBlock, setModalDefinitionBlock] = useState(null);


	// In ADD mode send dataBlockId as NULL
	// in EDIT mode sendt the data block Id
	const showModalToMutateBlock = (definitionBlock: StudentProfileDefinition, dataBlockId: string) => {
		setIsModalOpen(true);
		setModalDefinitionBlock(definitionBlock);
		setDataBlockId(dataBlockId)
		const defaultValuesObj = {};

		if (!dataBlockId) {
			Object.entries(definitionBlock.field_defs).forEach(e => {
				defaultValuesObj[e[1]._id] = e[1].multi_type === 0 ? supportedFieldsDefaultValues[e[1].type] : (e[1].multi_type === 1 ? "" : []);
			})
		} else {
			const dataBlock = studentProfileDataBlocks.find(e => e._id === dataBlockId);

			Object.entries(definitionBlock.field_defs).forEach(e => {
				defaultValuesObj[e[1]._id] = JSON.parse(dataBlock.field_data.find(f => f._id === e[1]._id).value);
			})
		}

		setInitialValues(defaultValuesObj);
	}


	return (
		<div>
			{studentProfileDefinitions.map((currDefinitionBlock, indx) => {
				// find all the data blocks for this definitionBlock
				const dataBlocks = studentProfileDataBlocks.filter(dataBlock => (dataBlock.block_def_id === currDefinitionBlock._id));

				return (
					<div key={currDefinitionBlock._id} className="card-container p-4 my-4 ">
						<div className="font-bold text-lg">
							{currDefinitionBlock.block_name}
						</div>
						{/* find all the datablocks which are of the given block/block_id. */}
						{dataBlocks.length === 0 ? <div className="text-sm my-2">No data blocks found</div> : null}

						{dataBlocks.map((e, indx) => (
							<StudentProfileBlockDataView
								showModalToMutateBlock={showModalToMutateBlock}
								data={e}
								key={e._id}
								studentProfileDef={currDefinitionBlock}
							/>
						))}

						{dataBlocks.length === 0 || currDefinitionBlock.is_array ? <div className="text-right mb-3">
							<ButtonPrimarySmall onClick={() => {
								showModalToMutateBlock(currDefinitionBlock, null)
							}}>Add new Block</ButtonPrimarySmall>
						</div> : null}

						<div>
							<div className="flex gap-3 flex-wrap justify-end">
								{currDefinitionBlock.is_freezed ? <div className='bg-sky-100 text-sky-500  tag-style'>
									Field Freezed
								</div> : null}
								{currDefinitionBlock.is_required ? <div className='bg-red-100 text-red-500  tag-style'>
									Mandatory Field
								</div> : null}
								{currDefinitionBlock.requires_proof ? <div className='bg-sky-100 text-sky-500  tag-style'>
									Requires Proof
								</div> : null}
								{currDefinitionBlock.is_array ? <div className='bg-sky-100 text-sky-500  tag-style'>
									Multi blocks
								</div> : null}
							</div>
						</div>


					</div>
				)
			})}

			{(open && modalDefinitionBlock) ? <MutateStudentProfileDataBlockModal
				definitionBlock={modalDefinitionBlock}
				initialValues={initialValues}
				open={isModalOpen}
				setOpen={setIsModalOpen}
				studentId={studentId}
				dataBlockId={dataBlockId}
			/> : null}
		</div>
	)
}


export default StudentProfile;


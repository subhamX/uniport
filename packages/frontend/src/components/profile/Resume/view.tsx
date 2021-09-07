import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { ADD_STUDENT_PROFILE_BLOCK } from "../../../config/routes-config";
import LEGOActionDialog from "../../LegoActionDialog";
import { VerificationInfo } from "../Utils/VerificationInfo";


export const ResumeView = ({ meta, data }) => {
	let {
		attribute_id,
		attribute_type,
		is_array,
		label,
		is_blocked,
		required,
		requires_proof,
		options
	} = meta;

	let router = useRouter();


	let student_id = router.query.student_id as string;

	// data will be an array for sure;

	const [open, setOpen] = useState(false)
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null)
	const [success, setSuccess] = useState(false);

	const handleSubmit = async (e: any) => {
		try {
			// !FETCH REQUEST
			setLoading(true);

			let payload = {
				...e,
				student_id,
				attribute_id,
				attribute_type
			}
			let data = await ADD_STUDENT_PROFILE_BLOCK(payload);
			if (data['error']) {
				throw Error(data['message'])
			}
			// success
			setSuccess(true);
			setLoading(false);
		} catch (err) {
			setLoading(false);
			setError(err.message);
		}

	}

	return (

		<div>

			<div className="bg-white px-4 py-4 flex my-2 rounded-lg shadow flex-col gap-2">
				<div >
					<h2 className="text-base font-bold text-gray-700 my-0">{label}</h2>
				</div>

				{data.length === 0 && required && (
					<div className='my-1 text-xs text-left text-blue-600 bg-blue-500 bg-opacity-10 border border-blue-400 flex items-center p-2 rounded-md'>
						This field is mandatory. Please considering adding atleast 1 block by clicking the button below.
					</div>
				)}
				{data.map(e => (
					<Single
						data={e}
					/>
				))}
				{/* if data.length is 0 and required then add a toast and say that atleast 1 qty is needed */}
				{/* if it's an array field then keep this btn or there are 0 elements */}
				<div className='flex justify-between items-center'>
					{(data.length === 0 || is_array) &&
						<div onClick={() => setOpen(true)} className='btn bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>
							Add new?
						</div>}
					{required ? <div className='tag-style bg-yellow-200 text-red-700  px-2 py-1'>Required</div> : null}
				</div>

				{open && <LEGOActionDialog
					title='Add Resume'
					formSchema={[
						{
							"label": "File Name",
							"type": "text",
							"id": "file_name",
							"placeholder": "SDE Resume"
						},
						{
							id: 'file_url',
							label: 'Select file',
							placeholder: '',
							type: 'file',
							additionalEntries: {
								accept: 'application/pdf'
							}
						}
					]}
					loading={loading}
					success={success}
					errorMessage={error}
					handleSubmit={handleSubmit}
					open={open}
					setOpen={setOpen}
					initialValues={{
						file_name: '',
						file_url: ''
					}}
				/>
				}
			</div>
		</div>


	);
}




const Single = ({ data }) => {
	let { file_name, file_url, verification_info } = data
	return (
		<div className='flex flex-col text-sm  py-1 border-b'>

			<div className='flex justify-between items-center gap-4 md:gap-0 md:grid md:grid-cols-2'>
				<div className='flex-shrink'>
					<Image src={require('../../../assets/images/resume.svg')} width={70} height={70} />
				</div>
				<div className='flex flex-col flex-grow'>
					<div>{file_name}</div>
					<a href={file_url} target='_blank' className='text-blue-500  underline' >Resume Link</a>
				</div>
			</div>

			<div className='flex justify-end gap-3 pt-2'>

				{/* // Irrespective of whatever it says for resume field we should make it always false; Since the fileUrl is already shown as link */}
				<VerificationInfo
					verification_info={verification_info}
				/>
			</div >
		</div >
	)
}



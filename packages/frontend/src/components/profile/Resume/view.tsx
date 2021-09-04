import Image from "next/image";
import { intToRomanNum } from "../../../helpers/IntToRomanNum";
import { ActionsBar } from "../Utils/ActionsBar";


export const ResumeView = ({ label, data, isBlocked, fieldId, elementIndex, requiresProof }) => {
	let {
		fileName,
		fileUrl,
		isVerified,
		verifyActionTimestamp
	} = data;


	return (
		<div className='flex flex-col text-sm  py-1 border-b'>
			<div className='py-0.5 font-medium text-gray-700'>{label} {intToRomanNum(elementIndex)}</div>
			<div className='flex justify-between items-center gap-4 md:gap-0 md:grid md:grid-cols-2'>
				<div className='flex-shrink'>
					<Image src={require('../../../assets/images/resume.svg')} width={70} height={70} />
				</div>
				<div className='flex flex-col flex-grow'>
					<div>{fileName}</div>
					<a href={fileUrl} target='_blank' className='text-blue-500  underline' >Resume Link</a>
				</div>
			</div>
			<ActionsBar
				fieldId={fieldId}
				fileUrl={fileUrl}
				requiresProof={requiresProof}
				isBlocked={isBlocked}
				isVerified={isVerified}
				verifyActionTimestamp={verifyActionTimestamp}
			/>
		</div>

	);
}

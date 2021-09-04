import Image from "next/image";
import { intToRomanNum } from "../../../helpers/IntToRomanNum";
import { ActionsBar } from "../Utils/ActionsBar";


export const CurrentCourseView = ({ label, data, isBlocked, elementIndex, fieldId, requiresProof }) => {
	let { program,
		specialization,
		courseStartDate,
		courseEndDate,
		percent_score,
		institute_roll,
		description, fileUrl,
		isVerified,
		verifyActionTimestamp } = data;

	return (
		<div className='flex flex-col text-sm py-1 border-b'>
			<div className='py-0.5 font-medium text-gray-700'>{label} {intToRomanNum(elementIndex)}</div>
			<div className='flex justify-between items-center gap-4 md:gap-0 md:grid md:grid-cols-2'>
				<div className='flex-shrink'>
					<Image src={require('../../../assets/images/library.svg')} width={70} height={70} />
				</div>
				<div className='flex flex-col flex-grow'>
					<div className='flex flex-col text-gray-600'>
						<div>{program}</div>
						<div>{specialization}</div>
					</div>
					<div className='flex gap-2 text-gray-500'>
						<div>{courseStartDate}</div>
						-
						<div>{courseEndDate}</div>
					</div>
					<div className='flex gap-2 text-gray-500'>
						<div>{percent_score}%,</div>
						<div>{institute_roll}</div>
					</div>
				</div>
			</div>
			<div className='text-gray-400 pt-2'>{description}</div>
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
	// <div className='border-b px-4 py-1 text-sm hover:bg-gray-50'>
	// 	<div className="flex justify-between ">
	// 		<p className="text-gray-600">
	// 			{label}
	// 		</p>
	// 		<p>
	// 			{value}
	// 		</p>
	// 	</div>

	// </div>

}

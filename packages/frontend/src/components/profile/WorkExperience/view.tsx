import Image from "next/image";
import { intToRomanNum } from "../../../helpers/IntToRomanNum";
import { ActionsBar } from "../Utils/ActionsBar";


export const WorkExperienceView = ({ label, data, isBlocked, fieldId, elementIndex, requiresProof }) => {
	let { company_name,
		job_title,
		location,
		position_type,
		jobStartDate,
		jobEndDate,
		details,
		fileUrl,
		isVerified, verifyActionTimestamp } = data;

	return (
		<div className='flex flex-col text-sm py-1 border-b'>
			<div className='py-0.5 font-medium text-gray-700'>{label} {intToRomanNum(elementIndex)}</div>
			<div className='flex justify-between items-center gap-4 md:gap-0 md:grid md:grid-cols-2'>
				<div className='flex-shrink'>
					<Image src={require('../../../assets/images/company.svg')} width={70} height={70} />
				</div>
				<div className='flex flex-col flex-grow'>
					<div>{job_title}</div>
					<div className='flex text-gray-600'>
						<div>{company_name}</div>
						<span className='px-1'>|</span>
						<div>{position_type}</div>
					</div>
					<div className='flex text-gray-500'>
						<div className='flex gap-2'>
							<div>{jobStartDate}</div>
							-
							<div>{jobEndDate}</div>
						</div>
					</div>
					<div className='text-gray-500'>
						{location}
					</div>
				</div>
			</div>
			<div className='text-gray-400 pt-2'>{details}</div>
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

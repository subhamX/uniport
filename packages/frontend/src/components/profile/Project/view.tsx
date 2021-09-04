import Image from "next/image";
import { intToRomanNum } from "../../../helpers/IntToRomanNum";
import { ActionsBar } from "../Utils/ActionsBar";


export const ProjectView = ({ label, data, isBlocked, elementIndex, fieldId, requiresProof }) => {
	let {
		projectName,
		startDate,
		endDate,
		projectUrl,
		description,
		isVerified,
		verifiedBy,
		verifyActionTimestamp,
		fileUrl
	} = data;


	return (
		<div className='flex flex-col text-sm py-1 border-b'>
			<div className='py-0.5 font-medium text-gray-700'>{label} {intToRomanNum(elementIndex)}</div>
			<div className='flex justify-between items-center gap-4 md:gap-0 md:grid md:grid-cols-2'>
				<div className='flex-shrink'>
					<Image src={require('../../../assets/images/project.svg')} width={70} height={70} />
				</div>
				<div className='flex flex-col flex-grow'>
					<div>{projectName}</div>
					{projectUrl && <div className='flex'>
						<a href={projectUrl} target='_blank' className='text-blue-500  underline' >Project Link</a>
					</div>}
					<div className='flex text-gray-500'>
						<div className='flex gap-2'>
							<div>{startDate}</div>
							-
							<div>{endDate}</div>
						</div>
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
}

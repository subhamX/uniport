import dayjs from "dayjs";
import { ActionsBar } from "../Utils/ActionsBar";
import {intToRomanNum} from '../../../helpers/IntToRomanNum';

export const GenericKeyValueView = ({ label, value, isVerified, verifyActionTimestamp, elementIndex, isBlocked, fieldId, fileUrl, requiresProof }) => (
	<div className='border-b text-sm py-1 hover:bg-gray-50'>
		<div className="grid md:grid-cols-2">
			<p className="font-medium text-gray-700 pb-0.5">
				{label} {intToRomanNum(elementIndex)}
			</p>
			<p className='text-gray-500'>
				{value}
			</p>
		</div>
		<div>

			<ActionsBar
				isBlocked={isBlocked}
				fieldId={fieldId}
				fileUrl={fileUrl}
				requiresProof={requiresProof}

				isVerified={isVerified}
				verifyActionTimestamp={verifyActionTimestamp}
			/>
		</div>
	</div>

)

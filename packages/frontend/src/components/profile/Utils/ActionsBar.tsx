import Image from "next/image";
import { NotVerifiedTag } from "./NotVerifiedTag";
import { VerifiedActionTimeTag } from "./VerifiedActionTimeTag";
import { VerifiedTag } from "./VerifiedTag";



export const ActionsBar = ({ isVerified, verifyActionTimestamp, isBlocked, requiresProof, fieldId, fileUrl }) => (
	// Need fieldId to call the modal for editting
	// Need the fileUrl to render the proof

	<div className='flex justify-end gap-3 pt-2'>
		{fileUrl ?
			<div className='tag-style bg-pink-100 text-pink-500 flex align-middle gap-1 cursor-pointer'>
				<Image src={require('../../../assets/images/eye.svg')} alt='paper-clip' width='10' height='10' />
				Attachments
			</div>
			: null}
		{!isBlocked ?
			<div className='tag-style bg-blue-100 text-blue-500 flex align-middle gap-1 cursor-pointer'>
				<Image src={require('../../../assets/images/edit.svg')} alt='paper-clip' width='10' height='10' />
				Edit
			</div> : null}

		{isVerified ? <>
			<VerifiedTag />
			<VerifiedActionTimeTag timestamp={verifyActionTimestamp} />
		</> : <NotVerifiedTag />}
	</div>
)

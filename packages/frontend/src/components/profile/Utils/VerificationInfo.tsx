import Image from "next/image";
import { NotVerifiedTag } from "./NotVerifiedTag";
import { VerifiedActionTimeTag } from "./VerifiedActionTimeTag";
import { VerifiedTag } from "./VerifiedTag";



// ! Adding flex container is the caller responsibility
export const VerificationInfo = ({ verification_info }) => (
	// @deprecated: Need fieldId to call the modal for editting
	// @deprecated: Need the fileUrl to render the proof
	<div>
		{/* {fileUrl ?
			<div className='tag-style bg-pink-100 text-pink-500 flex align-middle gap-1 cursor-pointer'>
				<Image src={require('../../../assets/images/eye.svg')} alt='paper-clip' width='10' height='10' />
				Attachments
			</div>
			: null} */}
		{/* {!isBlocked ?
			<div className='tag-style bg-blue-100 text-blue-500 flex align-middle gap-1 cursor-pointer'>
				<Image src={require('../../../assets/images/edit.svg')} alt='paper-clip' width='10' height='10' />
				Edit
			</div> : null} */}

		{verification_info.is_verified ? <>
			<VerifiedTag />
			<VerifiedActionTimeTag timestamp={verification_info.verify_action_timestamp} />
		</> : <NotVerifiedTag />}
	</div>
)

{/* <div className='flex justify-end gap-3 pt-2'> */ }



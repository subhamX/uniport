import Image from "next/image";
import { NotVerifiedTag } from "./NotVerifiedTag";
import { VerifiedActionTimeTag } from "./VerifiedActionTimeTag";
import { VerifiedTag } from "./VerifiedTag";
import { VerificationInfo } from '@uniport/common'
import { Maybe } from "graphql/jsutils/Maybe";


// ! Adding flex container is the caller responsibility
export const VerificationInfoView = ({ verification_info }: { verification_info: Maybe<VerificationInfo> }) => (
	<div className="flex gap-3 flex-wrap">
		{verification_info ? <>
			<VerifiedTag />
			<VerifiedActionTimeTag timestamp={verification_info.timestamp} />
			<div className='bg-sky-100 text-sky-500  tag-style'>
				Verified by: {verification_info.verifier_name}
			</div>
		</> : <NotVerifiedTag />}
	</div>
)

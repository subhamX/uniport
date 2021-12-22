import { BlockData, StudentProfileDefinition } from "@uniport/common";
import { VerificationInfoView } from "../profile/Utils/VerificationInfoView";
import { ButtonPrimarySmall } from "../ui/buttons/ButtonPrimary";




/**
 * UI component to render a student profile BlockData instance
 * Ensure that the [data] is for the given [studentProfileDef] only!
 */
export const StudentProfileBlockDataView = ({ studentProfileDef, data, showModalToMutateBlock }: { showModalToMutateBlock: any, studentProfileDef: StudentProfileDefinition, data: BlockData }) => {
	if (studentProfileDef._id !== data.block_def_id) {
		return (
			<div>
				Logic error!
			</div>
		)
	}

	const { _id: blockId,
		block_name,
		field_defs: fieldDefs } = studentProfileDef;
	return (
		<div className="my-5">
			<div className="py-2 px-4 shadow-lg border-sky-600 border">
				{fieldDefs.map((field, indx) => {
					const fieldData = data.field_data.find(e => e._id === field._id);
					let values = [];

					if (fieldData) {
						// [value] is a JSON encoded value
						const decodedValue = JSON.parse(fieldData.value);
						values = [...(field.multi_type === 2 ? decodedValue : [decodedValue])];
					}

					return (
						<div className="description-group" key={indx}>
							<div className="description-group-key">
								{field.field_name}
							</div>
							<div className="description-group-value flex gap-3">
								{values.map((value, indx) => {
									// it;s a single value
									return <div className="" key={indx}>
										{(field.type === 'integer' || field.type === 'text' || field.type === 'email') ? value : (
											field.type === 'float' ? value : (
												field.type === 'markdown' ? value : (
													field.type === 'date' ? new Date(value).toDateString() : null
												))
										)}
									</div>
								})}
							</div>
						</div>
					)

				})}

				<div className="text-right">

					{/* if not freezed then show edit button */}
					{!studentProfileDef.is_freezed ? <div>
						<ButtonPrimarySmall onClick={() => {
							showModalToMutateBlock(studentProfileDef, data._id)
						}}>Edit Block</ButtonPrimarySmall>
					</div> : null}
				</div>
				<div>
					{/* Verfication info: {data.verification_info} */}
					<VerificationInfoView
						verification_info={data.verification_info}
					/>
				</div>
			</div>
		</div>
	)
}


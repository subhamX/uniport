import { useMutation } from "@apollo/client";
import { StudentProfileDefinition, MutateStudentProfileBlockDataInput } from "@uniport/common";
import dayjs from "dayjs";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "react-toastify";
import { GET_STUDENT_PROFILE_BY_ID } from "../../graphql/GetStudentProfileById";
import { MUTATE_STUDENT_PROFILE_BLOCK_DATA } from "../../graphql/MutateStudentProfileBlockData";
import GenericModal from "../GenericModal/GenericModal";
import { ButtonInvertedPrimary } from "../ui/buttons/ButtonInvertedPrimary";
import { ButtonPrimary } from "../ui/buttons/ButtonPrimary";
import { SectionHeading } from "../ui/typography/SectionHeading";
import { SubSectionHeading } from "../ui/typography/SubSectionHeading";
import { DynamicStudentProfileDataForm } from "./DynamicStudentProfileDataForm";


/**
 * Modal to EDIT/ADD a student profile data block
 * Note: We should get the filled initialValues and dataBlockId for EDIT mode
 */
export const MutateStudentProfileDataBlockModal = ({
	dataBlockId,
	initialValues,
	studentId,
	definitionBlock,
	open,
	setOpen
}: {
	initialValues: any,
	dataBlockId?: string,
	studentId: string,
	definitionBlock: StudentProfileDefinition,
	setOpen: Dispatch<SetStateAction<boolean>>;
	open: boolean;
}) => {

	const [mutationFn, { data, loading, error }] = useMutation(
		MUTATE_STUDENT_PROFILE_BLOCK_DATA,
		{
			refetchQueries: [GET_STUDENT_PROFILE_BY_ID],
		}
	);

	const handleSubmit = async (e: any) => {
		try {
			const payload: MutateStudentProfileBlockDataInput = {
				// _id: initialValues._id,
				block_def_id: definitionBlock._id,
				user_id: studentId,
				fields: Object.entries(e).map(val => ({
					_id: val[0],
					value: JSON.stringify(val[1])
				}))
			};
			if (dataBlockId) payload['_id'] = dataBlockId;

			await mutationFn({
				variables: {
					payload,
				},
			});
			toast(`Block ${dataBlockId ? "edited" : "added"} successfully`, {
				onClose: () => setOpen(false),
			});
		} catch (err) {
			console.log(`Error: ${err}`);
			toast(`Something went wrong: ${err.message}`, { type: "error" });
		}
	};

	return (
		<div>
			<GenericModal setOpen={setOpen} open={open}>
				<div className="mx-auto">

					<Formik
						initialValues={initialValues}
						validator={() => ({})}
						onSubmit={handleSubmit}>
						<Form>
							<div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
								<SubSectionHeading>{dataBlockId ? "Edit" : "Add"} <span className="text-blue-600">{definitionBlock.block_name}</span> data block</SubSectionHeading>
								<DynamicStudentProfileDataForm
									definitionBlockFieldDefs={definitionBlock.field_defs}
								/>
							</div>

							<div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
								{/* ACTIONS */}
								<div>
									<div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">

										{/* ACTION BUTTON GOES HERE */}
										<ButtonPrimary type="submit" disabled={loading}>
											{dataBlockId ? "Update" : "Add"} data block
										</ButtonPrimary>
										<ButtonInvertedPrimary
											type="button"
											onClick={() => setOpen(false)}
											disabled={loading}
										>
											Cancel
										</ButtonInvertedPrimary>
									</div>
								</div>
							</div>
						</Form>
					</Formik>
				</div>

			</GenericModal>
		</div>
	)
}

import { useMutation } from "@apollo/client";
import { UpdateStudentProfileDefinitionInput } from "@uniport/common";
import { Form, Formik } from "formik";
import { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";
import { GET_STUDENT_PROFILE_DEFINITIONS } from "../../graphql/GetStudentProfileDefinitions";
import { UPDATE_STUDENT_PROFILE_DEFINITION } from "../../graphql/UpdateStudentProfileDefinition";
import GenericModal from "../GenericModal/GenericModal";
import { ButtonInvertedPrimary } from "../ui/buttons/ButtonInvertedPrimary";
import { ButtonPrimary } from "../ui/buttons/ButtonPrimary";
import { FormCheckboxField } from "../ui/form/FormCheckboxField";
import { FormIntegerField } from "../ui/form/FormIntegerField";
import FormTextField from "../ui/form/FormTextField";

/**
 * The following a modal that enables ADMIN to update the Student Profile Definition Block
 *
 * Note: The reason to keep it a modal and not a separate page is to give convenience.
 * Since it will be very bad UX to go to and fro between pages just to set a field as is_required etc
 *
 * @param initialValues: must contain all the data along with the _id
 */
export const EditStudentProfileDefBlockModal = ({
	setOpen,
	open,
	initialValues,
}: {
	setOpen: Dispatch<SetStateAction<boolean>>;
	open: boolean;
	initialValues: UpdateStudentProfileDefinitionInput;
}) => {
	const [mutationFn, { data, loading, error }] = useMutation(
		UPDATE_STUDENT_PROFILE_DEFINITION,
		{
			refetchQueries: [GET_STUDENT_PROFILE_DEFINITIONS],
		}
	);
	const handleSubmit = async (e: any) => {
		try {
			const payload: UpdateStudentProfileDefinitionInput = {
				_id: initialValues._id,
				block_name: e.block_name,
				is_freezed: false,
				is_required: e.is_required,
				requires_proof: e.requires_proof,
				position: e.position,
			};
			await mutationFn({
				variables: {
					payload,
				},
			});
			toast("Block edited successfully!", {
				onClose: () => setOpen(false),
			});
		} catch (err) {
			console.log(`Error: ${err}`);
			toast(`Something went wrong: ${err.message}`, { type: "error" });
		}
	};

	// TODO: Add frontend validation
	return (
		<div>
			<GenericModal setOpen={setOpen} open={open}>
				<div className="mx-auto">
					<Formik initialValues={initialValues} onSubmit={handleSubmit}>
						{({ values, errors }) => {
							return (
								<Form
									className="text-black"
									autoComplete="off"
									key="block_form"
								>
									<div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
										{/* Main content */}
										<div>
											<div className="subheading-text text-lg pb-2">
												Edit student profile block
											</div>

											<div>
												<FormTextField
													fieldLabel="Block Name"
													fieldId="block_name"
													placeholder="High School Education Details"
													isInline={true}
												/>

												<FormCheckboxField
													fieldId="is_required"
													fieldLabel="Is mandatory"
												/>

												<FormCheckboxField
													fieldId="requires_proof"
													fieldLabel="Does requires proof"
												/>

												<FormIntegerField
													fieldId="position"
													fieldLabel="Position (lower means higher priority)"
													isInline={true}
													placeholder="lower means higher priority"
												/>
											</div>
										</div>
									</div>

									<div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
										{/* ACTIONS */}
										<div>
											<div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
												{/* ACTION BUTTON GOES HERE */}
												<ButtonPrimary type="submit" disabled={loading}>
													Update block
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
							);
						}}
					</Formik>
				</div>
			</GenericModal>
		</div>
	);
};

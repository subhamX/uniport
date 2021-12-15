// component which shows the modal and asks the user to add a rule to the [campaign_id] passed as parameter
// have put [any] instead of [AddStudentProfileDefinitionsInput] as [options] is a string and not an array

import { useMutation } from "@apollo/client";
import Image from "next/image";
import {
	ErrorMessage,
	Field,
	FieldArray,
	Form,
	Formik,
	useFormikContext,
} from "formik";
import { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";
import { ADD_STUDENT_PROFILE_DEFINITION } from "../../graphql/AddStudentProfileDefinition";
import { GET_STUDENT_PROFILE_DEFINITIONS } from "../../graphql/GetStudentProfileDefinitions";
import { ButtonPrimary } from "../ui/buttons/ButtonPrimary";
import {
	AddStudentProfileDefinitionInput,
	supportedFieldsArray,
} from "@uniport/common";
import { multiTypeIdToText } from "../../pages/a/student-profile-definitions";
import DatePicker from "react-datepicker";
import FormTextField from "../ui/form/FormTextField";
import { FormCheckboxField } from "../ui/form/FormCheckboxField";
import { FormIntegerField } from "../ui/form/FormIntegerField";
import { FormSingleSelectField } from "../ui/form/FormSingleSelectField";
import HeadMeta from "../HeadMeta/HeadMeta";
import Layout from "../AuthLayout/Layout";
import { FormDateField } from "../ui/form/FormDateField";
import { FormEmailField } from "../ui/form/FormEmailField";
import { FormFloatField } from "../ui/form/FormFloatField";
import { FormMarkdownField } from "../ui/form/FormMarkdownField";
import { ButtonInvertedPrimary } from "../ui/buttons/ButtonInvertedPrimary";
import { ButtonSecondary } from "../ui/buttons/ButtonSecondary";
import router from "next/router";
import { MANAGE_STUDENT_PROFILE_DEFINITIONS } from "../../config/routes-config";

export const AddStudentProfileDefBlockForm = () => {
	const initialValues: AddStudentProfileDefinitionInput = {
		block_name: "",
		field_defs: [],
		is_array: false,
		is_freezed: false,
		is_required: true,
		requires_proof: false,
		position: 1,
	};

	const [mutationFn, { data, loading, error }] = useMutation(
		ADD_STUDENT_PROFILE_DEFINITION,
		{
			refetchQueries: [GET_STUDENT_PROFILE_DEFINITIONS],
		}
	);
	const handleSubmit = async (e) => {
		try {
			console.log("Final Push", e);
			const payload = {
				is_array: e.is_array,
				block_name: e.block_name,
				is_freezed: false,
				is_required: e.is_required,
				requires_proof: e.requires_proof,
				position: e.position,
				field_defs: e.field_defs.map((field, indx) => ({
					...field,
					position: indx,
					multi_type: parseInt(field.multi_type),
					options: JSON.stringify(field.options),
				})),
			};
			// edit mode
			// if (initialValues._id) payload["_id"] = initialValues._id;
			await mutationFn({
				variables: {
					payload,
				},
			});
			toast("Block added successfully!\n Redirecting to dashboard...", {
				onClose: () => router.push(MANAGE_STUDENT_PROFILE_DEFINITIONS),
			});
		} catch (err) {
			console.log(`Error: ${err}`);
			toast(`Something went wrong: ${err.message}`, { type: "error" });
		}
	};

	return (
		<>
			<div>
				<HeadMeta title="Uniport | Add Student Profile Definitions" />
				<Layout>
					<div className="mx-auto">
						<Formik initialValues={initialValues} onSubmit={handleSubmit}>
							{({ values }) => (
								<Form
									className="text-black"
									autoComplete="off"
									key="block_form"
								>
									<div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
										{/* Main content */}
										<div>
											<div className="subheading-text text-lg pb-2">
												Add a new student profile block
											</div>

											<div>
												<FormTextField
													fieldLabel="Block Name"
													fieldId="block_name"
													placeholder="High School Education Details"
													isInline={true}
												/>

												<FormCheckboxField
													fieldId="is_array"
													fieldLabel="Is array"
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

												<div className="my-4">
													<div className="subheading-text text-base">
														Fields
													</div>

													<FieldArray
														name="field_defs"
														render={(arrayHelpers) => (
															<div>
																<FieldSchemaArray
																	baseLabel={"field_defs"}
																	fields={values.field_defs}
																	fieldArrayHelper={arrayHelpers}
																/>
															</div>
														)}
													/>
												</div>
											</div>
										</div>
									</div>

									<div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
										{/* ACTIONS */}
										<div>
											<div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
												{/* ACTION BUTTON GOES HERE */}
												<ButtonPrimary type="submit" disabled={loading}>
													Add a new block
												</ButtonPrimary>
											</div>
										</div>
									</div>
								</Form>
							)}
						</Formik>
					</div>
				</Layout>
			</div>
		</>
	);
};

const FieldSchemaArray = ({ fieldArrayHelper, baseLabel, fields }) => {
	return (
		<>
			<div>
				{fields && fields.length > 0 ? (
					fields.map((field, index) => (
						<div key={index} className="card-container my-4 py-5 px-3 relative">
							<div className="text-right">
								<button
									type="button"
									className="absolute -top-2 -left-2"
									onClick={() => fieldArrayHelper.remove(index)} // remove a friend from the list
								>
									<Image
										src={require("../../assets/images/cancel.svg")}
										layout="intrinsic"
										width={35}
										height={35}
									/>
								</button>
							</div>
							<div>
								<FormTextField
									fieldId={`${baseLabel}.${index}.field_name`}
									placeholder="Institute Name"
									fieldLabel="Field Name"
									isInline={true}
								/>
								{/* ! it's confusing maybe for the user to enter position of the field. So we aren't having it!  */}

								<FormSingleSelectField
									fieldId={`${baseLabel}.${index}.type`}
									fieldLabel="Field Datatype"
									options={supportedFieldsArray.map((e) => ({
										value: e,
										label: e,
									}))}
									isInline={true}
								/>

								<FormSingleSelectField
									fieldId={`${baseLabel}.${index}.multi_type`}
									fieldLabel="Field type"
									options={Object.entries(multiTypeIdToText).map((e) => ({
										value: e[0],
										label: e[1],
									}))}
									isInline={true}
								/>

								<FormCheckboxField
									fieldId={`${baseLabel}.${index}.required`}
									fieldLabel="Required"
								/>

								{/* TODO: options */}
								{field.multi_type !== 0 ? (
									<div>
										<div className="info-box">
											Select Options of type{" "}
											<span className="font-bold">{field.type}</span>
											<div className="mt-2">
												Note: You must add at least one option!
											</div>
										</div>
										<FieldArray name={`${baseLabel}.${index}.options`}>
											{(arrayHelpers) => (
												<FieldOptions
													key={`${baseLabel}.${index}.options`}
													baseLabel={`${baseLabel}.${index}`}
													type={field.type}
													options={field.options}
													fieldOptionsArrayHelpers={arrayHelpers}
												/>
											)}
										</FieldArray>
									</div>
								) : null}
							</div>
						</div>
					))
				) : (
					<div className="info-box">
						No fields added! (You must add at least one field to this block)
					</div>
				)}
			</div>

			<div className="text-right">
				<ButtonPrimary
					type="button"
					onClick={() =>
						fieldArrayHelper.insert(fields ? fields.length : 0, {
							field_name: "",
							position: 1,
							type: "integer",
							options: [],
							required: true,
							multi_type: 0,
						})
					}
				>
					Add a new field
				</ButtonPrimary>
			</div>
		</>
	);
};

// functional component to generate [options] of specified type
const FieldOptions = ({
	baseLabel,
	fieldOptionsArrayHelpers,
	options,
	type,
}) => {
	return (
		<div>
			{options && options.length > 0
				? options.map((option, index) => (
						<div key={index} className="my-4 py-4 px-3 relative">
							<div className="text-right">
								<button
									type="button"
									className="absolute -top-2 -left-2"
									onClick={() => fieldOptionsArrayHelpers.remove(index)}
								>
									<Image
										src={require("../../assets/images/cancel.svg")}
										layout="intrinsic"
										width={35}
										height={35}
									/>
								</button>
							</div>

							{/* add field */}
							{type === "date" ? (
								<FormDateField
									isInline={true}
									fieldLabel={`Option ${index}`}
									fieldId={`${baseLabel}.options.${index}`}
								/>
							) : type === "integer" ? (
								<FormIntegerField
									fieldId={`${baseLabel}.options.${index}`}
									isInline={true}
									fieldLabel={`Option ${index}`}
								/>
							) : type === "text" ? (
								<FormTextField
									fieldId={`${baseLabel}.options.${index}`}
									isInline={true}
									fieldLabel={`Option ${index}`}
								/>
							) : type === "email" ? (
								<FormEmailField
									fieldId={`${baseLabel}.options.${index}`}
									isInline={true}
									fieldLabel={`Option ${index}`}
								/>
							) : type === "float" ? (
								<FormFloatField
									isInline={true}
									fieldId={`${baseLabel}.options.${index}`}
									fieldLabel={`Option ${index}`}
								/>
							) : (
								<FormMarkdownField
									fieldId={`${baseLabel}.options.${index}`}
									fieldLabel={`Option ${index}`}
								/>
							)}
						</div>
				  ))
				: null}

			<div className="text-right">
				<ButtonSecondary
					type="button"
					onClick={() =>
						fieldOptionsArrayHelpers.insert(
							options ? options.length : 0,
							type === "integer" || type === "float"
								? 0
								: type === "date"
								? new Date()
								: ""
						)
					}
				>
					Add a new option
				</ButtonSecondary>
			</div>
		</div>
	);
};

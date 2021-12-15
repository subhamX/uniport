import { useQuery } from "@apollo/client";
import { useState } from "react";
import HeadMeta from "../../../components/HeadMeta/HeadMeta";
import Layout from "../../../components/AuthLayout/Layout";
import { GET_STUDENT_PROFILE_DEFINITIONS } from "../../../graphql/GetStudentProfileDefinitions";
import { ButtonPrimary } from "../../../components/ui/buttons/ButtonPrimary";
import { ButtonInvertedPrimary } from "../../../components/ui/buttons/ButtonInvertedPrimary";
import router from "next/router";
import { ADD_STUDENT_PROFILE_DEFINITION } from "../../../config/routes-config";
import { EditStudentProfileDefBlockModal } from "../../../components/StudentProfileDefinitions/EditStudentProfileDefBlockModal";

export const multiTypeIdToText = {
	0: "Field without options",
	1: "Single Select Field",
	2: "Multi Select Field",
};

/**
 * Component to show all the student profile definitions
 * It gives a nice interface to edit the modal too. And a button, which redirects to different route to add new student profile definition.
 */
const StudentProfileDefinitionsDash = () => {
	let { data, loading, error } = useQuery(GET_STUDENT_PROFILE_DEFINITIONS);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [initialValues, setInitialValues] = useState({});

	// storing the definitions in a variable for convenience
	const definitions = loading
		? []
		: data.getStudentProfileDefinitions.map((block) => ({
			...block,
			field_defs: block.field_defs.map((field) => ({
				...field,
				options: JSON.parse(field.options),
			})),
		}));

	return (
		<div>
			<HeadMeta title="Uniport | Manage Student Profile Definitions" />
			<Layout>
				<div className="p-10">
					{loading ? (
						<div className="my-3 text-sm text-left text-blue-600 bg-blue-500 bg-opacity-10 border border-blue-400 flex items-center p-4 rounded-md">
							Loading Student Profile Definitions
						</div>
					) : null}
					{error ? (
						<div className="my-3 text-sm text-left text-red-600 bg-red-500 bg-opacity-10 border border-red-400 flex items-center p-4 rounded-md">
							Something went wrong: {error.message}
						</div>
					) : null}

					{data ? (
						<div className="card-container shadow-sky-600 px-3 py-5 mx-auto max-w-2xl">
							<div className="text-2xl font-bold leading-normal mt-0 mb-3 text-purple-800">
								Manage Student Profile Definitions
							</div>
							<div className="info-box text-blue-600 bg-blue-500 bg-opacity-10 border border-blue-400 ">
								Each of the following block maps to a profile element in the
								Student Profile.
								<br />
							</div>
							<div className="info-box bg-blue-500 bg-opacity-10 border  text-indigo-600 bg-indigo-500 border-indigo-400">
								The following options are nested inside the Edit Block button.
								<ul className="pl-2 pt-1">
									<li>
										* Freeze the attribute: No further changes can be performed
										by students on the attribute
									</li>
									<li>* Mandate proofs</li>
									<li>* Toggle state from required</li>
									<li>* ..</li>
								</ul>
							</div>
							<div className="flex justify-end">
								<ButtonPrimary
									onClick={() => router.push(ADD_STUDENT_PROFILE_DEFINITION)}
								>
									Add a new block
								</ButtonPrimary>
							</div>

							<EditStudentProfileDefBlockModal
								setOpen={setIsModalOpen}
								initialValues={initialValues as any}
								open={isModalOpen}
							/>

							<div className="border-gray-200">
								{definitions.map((e, indx) => {
									return (
										<div key={indx} className="card-container shadow-md my-4">
											<div className="px-4 py-3 sm:px-6">
												<h3 className="text-base font-medium text-gray-900">
													Block {indx + 1}
												</h3>
											</div>
											<div className="description-group">
												<div className="description-group-key">Block Name</div>
												<div className="description-group-value">
													{e.block_name}
												</div>
											</div>
											<div className="description-group">
												<div className="description-group-key">Is Blocked</div>
												<div className="description-group-value">
													{e.is_freezed ? "YES" : "NO"}
												</div>
											</div>
											<div className="description-group">
												<div className="description-group-key">is Array?</div>
												<div className="description-group-value">
													{e.is_array ? "YES" : "NO"}
												</div>
											</div>
											<div className="description-group">
												<div className="description-group-key">
													Position (lower means higher priority)
												</div>
												<div className="description-group-value">
													{e.position}
												</div>
											</div>

											<div className="description-group">
												<div className="description-group-key">
													Is required?
												</div>
												<div className="description-group-value">
													{e.required ? "YES" : "NO"}
												</div>
											</div>

											<div className="description-group">
												<div className="description-group-key">
													Requires Proof
												</div>
												<div className="description-group-value">
													{e.requires_proof ? "YES" : "NO"}
												</div>
											</div>

											<div className="py-2 flex flex-col px-6">
												<div className="description-group-key pb-4">Fields</div>
												<div className="">
													{e.field_defs.map((field, index) => {
														const options = field.options;

														return (
															<div
																className="mb-3 shadow-sky-400 shadow-md border-gray-600 border"
																key={index}
															>
																<div className="description-group">
																	<div className="description-group-key">
																		Field name:
																	</div>
																	<div>{field.field_name}</div>
																</div>

																<div className="description-group">
																	<div className="description-group-key">
																		Field type:
																	</div>
																	<div className="description-group-value">
																		{field.type}
																	</div>
																</div>

																<div className="description-group">
																	<div className="description-group-key">
																		Options:
																	</div>
																	<div className="flex flex-wrap gap-2">
																		{options.map((option, index) => (
																			<div
																				key={index}
																				className="px-2 py-1 rounded bg-black text-white"
																			>
																				{option}
																			</div>
																		))}
																	</div>
																</div>

																<div className="description-group">
																	<div className="description-group-key">
																		Required:
																	</div>
																	<div className="description-group-value">
																		{field.required ? "YES" : "NO"}
																	</div>
																</div>

																<div className="description-group">
																	<div className="description-group-key">
																		Multi :
																	</div>
																	<div className="description-group-value">
																		{multiTypeIdToText[field.multi_type]}
																	</div>
																</div>
															</div>
														);
													})}
												</div>
											</div>

											<div className="flex justify-end">
												<div className="px-4 py-2 sm:px-6">
													<ButtonInvertedPrimary
														onClick={() => {
															setInitialValues(e);
															setIsModalOpen(true);
														}}
													>
														Edit Block
													</ButtonInvertedPrimary>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					) : null}
				</div>
			</Layout>
		</div>
	);
};

export default StudentProfileDefinitionsDash;

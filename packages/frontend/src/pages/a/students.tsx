import HeadMeta from "../../components/HeadMeta/HeadMeta";
import Layout from "../../components/AuthLayout/Layout";
import withAuth from "../../HOC/withAuth";
import { useQuery } from "@apollo/client";
import { GET_STUDENT_PROFILE_BY_QUERY } from "../../graphql/GetStudentProfileByQuery";
import { useEffect, useState } from "react";
import { StudentProfile } from "@uniport/common";
import { SectionHeading } from "../../components/ui/typography/SectionHeading";
import { SectionLoading } from "../../components/ui/Loaders/SectionLoading";
import Link from 'next/link';
import Image from 'next/image';
import { STUDENT_PROFILE_ROUTE } from "../../config/routes-config";
import { ButtonPrimarySmall } from "../../components/ui/buttons/ButtonPrimary";
import { ResponsiveTable } from "../../components/ui/Table/ResponsiveTable";


const ColorAvatar = ({ seed }: { seed: number }) => {
	// const colors = ["red-500", "blue-500", "sky-500", "gray-500", "green-400", "blue-500", "indigo-500"]
	return (
		<div className="flex-shrink-0 h-10 w-10">
			{/* <div className={`w-full h-full rounded-full bg-gradient-to-${seed % 2 ? 'r' : 'r'} from-${colors[seed % colors.length]} to-${colors[(seed + 1) % colors.length]}`}></div> */}
			<div className={`w-full h-full rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-cyan-500`}></div>
		</div>
	)
}


const pageSize = 10;
// TODO: Add filter groups support
const StudentProfiles = () => {
	const [offset, setOffset] = useState(0);
	const [filterGroups, setFilterGroups] = useState([]);

	const { data, error, loading, refetch } = useQuery(GET_STUDENT_PROFILE_BY_QUERY, {
		variables: {
			payload: {
				offset,
				page_size: pageSize,
				filter_groups: filterGroups,
			}
		}
	});

	useEffect(() => {
		refetch();
	}, [offset]);


	const students: StudentProfile[] = data ? data.getStudentProfileByQuery : [];
	// const students: StudentProfile[] = data ? [...data.getStudentProfileByQuery, ...data.getStudentProfileByQuery, ...data.getStudentProfileByQuery, ...data.getStudentProfileByQuery, ...data.getStudentProfileByQuery, ...data.getStudentProfileByQuery, ...data.getStudentProfileByQuery] : [];

	return (
		<div>
			<HeadMeta title='Uniport | Students' />
			<Layout>
				<div className='p-10'>

					<SectionHeading>
						Student Profiles
					</SectionHeading>

					<ResponsiveTable
						tableFooterContents={
							<div className="flex justify-between px-6">
								<div className="my-auto text-xs border px-2 py-2">
									Page {offset / pageSize + 1}
								</div>
								<div className="flex gap-3 justify-end">
									<ButtonPrimarySmall disabled={offset === 0}
										onClick={() => setOffset(offset - pageSize)}>
										Previous
									</ButtonPrimarySmall>
									<ButtonPrimarySmall disabled={students.length === 0}
										onClick={() => setOffset(offset + pageSize)}>
										Next
									</ButtonPrimarySmall>
								</div>
							</div>
						}
						tableHeadContents={
							<>
								<tr>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Name
									</th>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Email Address
									</th>
									{filterGroups && filterGroups.length ? <th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Matched Groups
									</th> : null}
									<th scope="col" className="relative px-6 py-3">
										<span className="sr-only">View Complete Profile</span>
									</th>
								</tr>
							</>
						}
						tableDataContents={
							<>
								{!loading && students.length === 0 ? <tr>
									<td colSpan={3 + (filterGroups.length === 0 ? 0 : 1)}>
										<div className="info-box text-center mx-3">
											We found 0 results for "search", please try searching again.
										</div>
									</td>
								</tr> : loading ?

									<td colSpan={3 + (filterGroups.length === 0 ? 0 : 1)}>
										<div className="info-box bg-purple-500 text-purple-800 text-center mx-3">
											Loading...
										</div>
									</td>

									: null}
								{students.length ?
									students.map((student, indx) => (
										<tr key={indx}>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="flex items-center">
													<ColorAvatar seed={indx} />
													<div className="ml-3">
														<div className="text-sm font-medium text-gray-900">{`${student.first_name} ${student.last_name}`}</div>
													</div>
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="text-sm text-gray-500">{student.email_address}</div>
											</td>
											{student.matched_groups ? <td className="px-6 gap-1 py-4 flex flex-wrap">
												{student.matched_groups.map((group) => (
													<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
														{`GROUP_${group}`}
													</span>
												))}
											</td> : null}
											{/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{person.role}</td> */}
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center text-white">
												<Link href={STUDENT_PROFILE_ROUTE(student._id)}>
													<div className="btn py-1 px-2  bg-sky-500 border-2 disabled:bg-gray-500 border-sky-700  hover:bg-cyan-700">
														View Complete profile
													</div>
												</Link>
											</td>
										</tr>
									)) :
									null
								}
							</>
						}
					/>
				</div>
			</Layout>
		</div>

	)
}

export default withAuth(StudentProfiles);


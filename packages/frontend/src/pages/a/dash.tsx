import HeadMeta from "../../components/HeadMeta/HeadMeta";
import Layout from "../../components/AuthLayout/Layout";
import withAuth from "../../HOC/withAuth";
import { useQuery } from "@apollo/client";
import { GET_STUDENT_PROFILE_BY_QUERY } from "../../graphql/GetStudentProfileByQuery";
import { useState } from "react";
import { StudentProfile } from "@uniport/common";
import { SectionHeading } from "../../components/ui/typography/SectionHeading";
import { SectionLoading } from "../../components/ui/Loaders/SectionLoading";
import Link from "next/link";
import { STUDENT_PROFILE_ROUTE } from "../../config/routes-config";

const ColorAvatar = ({ seed }: { seed: number }) => {
	// const colors = ["red-500", "blue-500", "sky-500", "gray-500", "green-400", "blue-500", "indigo-500"]
	return (
		<div className="flex-shrink-0 h-10 w-10">
			{/* <div className={`w-full h-full rounded-full bg-gradient-to-${seed % 2 ? 'r' : 'r'} from-${colors[seed % colors.length]} to-${colors[(seed + 1) % colors.length]}`}></div> */}
			<div
				className={`w-full h-full rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-cyan-500`}
			></div>
		</div>
	);
};

const AdminDash = () => {
	return (
		<div>
			<HeadMeta title="Uniport | Admin Dashboard" />
			<Layout>
				<div className="p-10">
					<SectionHeading>Admin Dashboard</SectionHeading>
				</div>
			</Layout>
		</div>
	);
};

export default withAuth(AdminDash);

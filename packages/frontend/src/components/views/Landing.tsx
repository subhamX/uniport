import HeadMeta from "../HeadMeta/HeadMeta";
import NoAuthNavbar from "../NonAuthNavbar/NonAuthNavbar";
import Link from "next/link";
import { REGISTER_ADMIN } from "../../config/routes-config";

const Landing = () => {
	return (
		<>
			<HeadMeta title={"Uniport | Home"} />
			<NoAuthNavbar />
			<WavyDesignContainer>
				<div className="ui-landing max-w-6xl">
					<div className="max-w-screen-xl px-4 py-24 mx-auto sm:px-6 lg:px-8 lg:flex lg:items-center">
						<div className="max-w-3xl mx-auto text-center">
							<div className="text-3xl font-extrabold text-transparent sm:text-6xl bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
								Manage Campus Recruitment seamlessly
							</div>
							<div className="max-w-xl mx-auto mt-6 text-lg">
								A fully customizable{" "}
								<span className="text-yellow-600">port</span>al for the{" "}
								<span className="text-yellow-600">uni</span>versities to manage
								campus recruitment and streamline hiring workflows.
							</div>

							<div className="mt-8 sm:justify-center sm:flex gap-10">
								<div className="block uppercase px-2 py-3 font-medium bg-black  border-black  border-2 hover:bg-gray-700 w-56 text-white">
									<Link href={REGISTER_ADMIN}>Get started for free</Link>
								</div>
								<div className="block uppercase px-2 py-3 font-medium border-black border-2 hover:bg-gray-700 hover:text-white w-40 text-black">
									<Link href='#'>Contact Us</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</WavyDesignContainer>
		</>
	);
};

export default Landing;

const WavyDesignContainer = ({ children }) => {
	return (
		<>
			<div className="min-h-screen overflow-x-hidden flex items-center justify-center">
				<div className="relative px-6">
					<div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
					<div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
					<div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
					<div className="m-8 relative space-y-4">{children}</div>
				</div>
			</div>
		</>
	);
};





import HeadMeta from "../components/views/HeadMeta";
import NonAuthNavbar from "../components/views/NonAuthNavbar";


const JoinNow = () => {
	return (
		<div>
			<HeadMeta title='UniPort | Join the Club' />
			<NonAuthNavbar />
			<div className='w-full mt-4'>
				<div className="mx-auto p-4 max-w-md shadow-md rounded-md text-left">
					<div className='text-gray-700 text-3xl font-semibold'>
						Join UniPort
					</div>

					<div className='my-3 text-sm text-left text-purple-600 bg-purple-500 bg-opacity-10 border border-purple-400 flex items-center p-4 rounded-md' role="alert">
						Please note that this registration form is only for institute admins. Incase you are a student and wish to register yourself on the portal, you shall ask for an invite from your institute admin.
					</div>
					{/* Actual Form */}
				</div>
			</div>
		</div>

	)
}

export default JoinNow;
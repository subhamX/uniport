import HeadMeta from "../../components/views/HeadMeta";
import Layout from "../../components/views/Layout";
import withAuth from "../../HOC/withAuth";


const AdminDash = () => {
	return (
		<div>
			<HeadMeta title='UniPort | Admin Dashboard' />
			<Layout>
				<div className='p-10'>
					{/* Content goes here */}
				</div>
			</Layout>
		</div>

	)
}

export default withAuth(AdminDash);

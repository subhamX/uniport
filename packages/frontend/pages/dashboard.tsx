import HeadMeta from "../components/views/HeadMeta";
import Layout from "../components/views/Layout";


// This route is only for authenticated users
// Layout is responsible for building the sidenav, topnav etc
const Dashboard = () => {
    return (
        <>
			<HeadMeta title='UniPort | Dashboard' />
            <Layout>
                <div className='p-10'>
                    {/* Content goes here */}
                </div>
            </Layout>
        </>

    )
}


export default Dashboard;
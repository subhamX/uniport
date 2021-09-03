import Head from 'next/head'
import HeadMeta from './HeadMeta';
import Layout from './Layout';
import Navbar from './NonAuthNavbar';

const Landing = () => {
	return (
		<>
			<HeadMeta title={"UniPort | Home"} />
			<Navbar />
			<div>
				Landing Page
			</div>
		</>
	)
}

export default Landing;


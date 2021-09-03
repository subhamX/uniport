import Head from 'next/head'
import HeadMeta from './HeadMeta';
import Layout from './Layout';
import NoAuthNavbar from './NonAuthNavbar';

const Landing = () => {
	return (
		<>
			<HeadMeta title={"UniPort | Home"} />
			<NoAuthNavbar />
			<div>
				Landing Page
			</div>
		</>
	)
}

export default Landing;


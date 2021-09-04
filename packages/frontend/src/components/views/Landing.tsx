import Head from 'next/head'
import HeadMeta from './HeadMeta';
import Layout from './Layout';
import NoAuthNavbar from './NonAuthNavbar';
import Image from 'next/image';


const Landing = () => {
	return (
		<>
			<HeadMeta title={"UniPort | Home"} />
			<NoAuthNavbar />
			<div className='flex md:grid md:grid-cols-2'>
				<div>
					Universal Portal to manage campus recruitments
				</div>
				<Image src={require('../../assets/images/landing.svg')} height='300' width='400' />
			</div>
		</>
	)

}

export default Landing;


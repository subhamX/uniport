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
			<div className='ui-landing'>
				<div className='grid grid-cols-2 max-w-7xl mx-auto gap-8 h-full'>
					<div className='text-3xl flex flex-col justify-center gap-5 font-bold leading-snug text-gray-700 mb-10 wow fadeInUp animated '>
						{/* The Universal Portal to manage seamlessly campus recruitments */}
						<div>
							A fully customizable <span className='text-yellow-500'>Uni</span>versal <span className='text-yellow-500'>Port</span>al for universities to manage the campus recruitments seamlessly.
						</div>
						<div className='flex'>
							<div className='rounded-full py-2 px-5 uppercase text-base font-bold tracking-wider cursor-pointer bg-blue-500 hover:bg-blue-700   text-white'>Join Now</div>
							{/* <div className='btn bg-blue-500 hover:bg-blue-700  text-white'>Join with invite</div> */}
						</div>
					</div>
					<Image src={require('../../assets/images/landing.svg')} height='300' width='400' />
				</div>
			</div>
		</>
	)

}

export default Landing;


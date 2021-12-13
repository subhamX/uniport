import HeadMeta from '../HeadMeta/HeadMeta';
import NoAuthNavbar from '../NonAuthNavbar/NonAuthNavbar';
import Image from 'next/image';
import Link from 'next/link';
import { REGISTER_ADMIN } from '../../config/routes-config';


const Landing = () => {
	return (
		<>
			<HeadMeta title={"Uniport | Home"} />
			<NoAuthNavbar />
			<WavyDesignContainer>
				<div className='ui-landing max-w-6xl'>
					<div className='flex flex-col items-center md:grid md:grid-cols-2 mx-auto gap-7'>
						<div>
							<div className='text-4xl md:text-5xl pb-4 font-heading font-black'>
								Manage Campus Recruitment seamlessly
							</div>
							<div className='text-lg  pb-6'>
								A fully customizable <span className='text-yellow-600'>port</span>al for the <span className='text-yellow-600'>uni</span>versities to manage campus recruitment seamlessly.
							</div>
							<Link href={REGISTER_ADMIN}>
								<div className='action-btn text-base tracking-wider cursor-pointer bg-black hover:bg-gray-700 w-64 text-white'>Get started for free</div>
							</Link>
						</div>
						<div className='w-5/6'>
							<Image src={require('../../assets/images/landing.svg')} layout='responsive' height='210' width='280' />
						</div>
						{/* <div className='rounded-full py-2 px-5 uppercase text-base font-bold tracking-wider cursor-pointer bg-green-500 hover:bg-green-700   text-white'>Join with Invite</div> */}
					</div>
				</div>
			</WavyDesignContainer>
		</>
	)

}

export default Landing;


const WavyDesignContainer = ({ children }) => {
	return (
		<>
			<div className="min-h-screen overflow-x-hidden flex items-center justify-center">
				<div className="relative px-6">
					<div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
					<div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
					<div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
					<div className="m-8 relative space-y-4">
						{children}
					</div>
				</div>
			</div>

		</>
	)
}

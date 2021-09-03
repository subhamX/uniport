import AuthNavbar from "./AuthNavbar";
import Navbar from "./NonAuthNavbar";

// For Authenticated Users;
const Layout = ({ children }) => {
  return (
    <div className='flex flex-col md:flex-row'>
      <div className='w-full md:w-72 z-40 inset-0 flex-none h-full bg-black bg-opacity-25 lg:bg-white lg:overflow-y-visible'>
        <AuthNavbar />
      </div>
      <div className='content'>
        {children}
      </div>
    </div>
  )
}

export default Layout;

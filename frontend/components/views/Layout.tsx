import Navbar from "./NonAuthNavbar";

// For Authenticated Users;
const Layout = ({ children }) => {
  return (
    <div className=''>
      <div className='content'>
        {children}
      </div>
    </div>
  )
}

export default Layout;
import { useState, Fragment } from "react";
import { Menu, Transition } from '@headlessui/react'
import SideNavigationBar from "./SideNavigationBar";
import Navbar from "./NonAuthNavbar";
import { useSideNavStore } from "../../global-stores/useSideNavStore";
import UniportLogo from "./Logo";
import Image from "next/image";

// For Authenticated Users;
const Layout = ({ children }) => {
  const isSideNavOpen = useSideNavStore(state => state.status)
  const toggleSideNavStatus = useSideNavStore(state => state.toggleSideNavStatus)
  const closeSideNav = useSideNavStore(state => state.close)

  return (
    <div className='flex'>
      <SideNavigationBar />
      <div className={`flex-1 flex flex-col ${isSideNavOpen ? 'bg-gray-500 cursor-default' : null} md:bg-transparent`}>
        <header className="flex justify-between items-center py-1 px-6 bg-nav-color ">
          <div className="flex items-center">
            <button className="text-gray-500 focus:outline-none md:hidden" onClick={toggleSideNavStatus}>
              <Image src={require('../../assets/images/menu.svg')} width={25} height={25} />
            </button>
          </div>

          <UniportLogo />
          <div className="flex items-center">
            <DropdownProfileMenu />
          </div>
        </header>

        <main onClick={closeSideNav} className='uniport-main-content overflow-y-scroll max-h-screen'>
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout;


const DropdownProfileMenu = () => {
  const [isMenuOpen, setisMenuOpen] = useState(false);
  return (
    <Menu>
      <div x-data="{ dropdownOpen: false }" className="relative">
        <Menu.Button className="relative block h-8 w-8 rounded-full overflow-hidden shadow focus:outline-none">
          <img className="h-full w-full object-cover" src="https://images.unsplash.com/photo-1528892952291-009c663ce843?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=296&q=80" alt="Your avatar" />
        </Menu.Button>
        {/* <div x-show="dropdownOpen" className="fixed inset-0 h-full w-full z-10" /> */}
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95">
          <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 ">
              <Menu.Item>
                {({ active }) => (
                  <button className={`${active ? 'bg-indigo-600 text-white' : 'text-gray-900'} flex rounded-md items-center w-full px-2 py-2 text-sm`}>
                    Profile
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button className={`${active ? 'bg-indigo-600 text-white' : 'text-gray-900'} flex rounded-md items-center w-full px-2 py-2 text-sm`}>
                    Logout
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </div>
    </Menu>
  )
}

import { useEffect } from 'react'
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'

import useAuthStore from '../../store/useAuthStore'
import { useNavigate } from 'react-router-dom'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
  const navigate=useNavigate();
  const{user,checkAuth,isAuthtenicted,logout}=useAuthStore();
  const handleLogout = async () => {
		try {
			await logout();
			console.log('Successfully logged out');
			navigate("/login");
		} catch (err) {
			console.error('Logout failed:', err.message || err);
			alert("Error: Unable to log out. Please try again.");
		}
	};

  useEffect(() => {
      checkAuth();
    }, [checkAuth]);

    const navigation = [
      { name: "Overview", href: "/", current: true },
      { name: "Reports", href: "/report", current: false },
      { name: "Inventory", href: "#", current: false },
      { name: "Analytics", href: "/analytics", current: false },
      { name: "Sign Up", href: "/signup", current: false },
      
       // The Dashboard link is conditionally included based on the login state
       ...(!isAuthtenicted
        ? [{ name: "SignIn", href: "/login", current: false }]
        : []),
     
  ];

  return (
    <Disclosure as="nav" className="bg-gray-800 fixed top-0 left-0 w-full z-50 ">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-20 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block size-6 group-data-[open]:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-[open]:block" />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center text-white lg:text-3xl text-2xl ">
              PPT Inovation
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    aria-current={item.current ? 'page' : undefined}
                    className={classNames(
                      item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'rounded-md px-3 py-2 text-lg font-medium',
                    )}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <button
              type="button"
              className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <span className="absolute -inset-1.5" />
              <span className="sr-only">View notifications</span>
              <BellIcon aria-hidden="true" className="size-6" />
            </button>

            {/* Profile dropdown */}
            <Menu as="div" className={`${(user==null)? "hidden" : ""} relative ml-3`}>
              <div >
                <MenuButton className=" relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  
                  {(user != null) && (
    <img 
        src={user.picture || "data:image/jpeg;base64,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"} 
        alt="Profile" 
        className="w-10 h-10 rounded-full" 
        loading="lazy" 
        onError={(e) => e.target.src = "https://via.placeholder.com/40"} 
    />
)}
                  
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                <MenuItem>
                  <a
                    href="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                  >
                    Your Profile
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                  >
                    Settings
                  </a>
                </MenuItem>
                <MenuItem>
                  <button
                    
                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                    onClick={handleLogout}>
                    Sign out
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2 ">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
              className={classNames(
                item.current ? 'bg-gray-900 text-white text-lg' : 'text-lg text-gray-300 hover:bg-gray-700 hover:text-white',
                'block rounded-md px-3 py-2 text-base font-medium',
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}

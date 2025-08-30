import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <header className="bg-white py-3 w-full">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="md:flex md:items-center md:gap-12">
            <Link className="block text-black cursor-pointer" href="/">
              <span className="text-black text-2xl underline font-bold">
                Notefolio
              </span>
            </Link>
          </div>

          <div className="hidden md:block">
            <nav aria-label="Global">
              <ul className="flex items-center gap-6 text-sm">
                <li>
                  <Link
                    className="text-gray-800 hover:text-gray-700 hover:underline duration-300 transition-all"
                    href="/blogs"
                  >
                    {" "}
                    Blogs
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="sm:flex sm:gap-4">
              <Link
                className=" bg-slate-50 hover:bg-slate-100 px-8  py-2.5 text-sm font-medium
                 text-black shadow-sm rounded-full transition-all duration-500"
                href="/auth/signin"
              >
                Login
              </Link>

              <div className="hidden sm:flex">
                <Link
                  className=" bg-stone-800 hover:bg-stone-900 transition-all duration-500 px-8  py-2.5 text-sm font-medium text-white shadow-sm rounded-full"
                  href="/auth/signup"
                >
                  Register
                </Link>
              </div>
            </div>

            <div className="block md:hidden">
              <button className="rounded-sm bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

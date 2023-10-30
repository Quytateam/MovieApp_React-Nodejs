import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaHeart, FaSearch } from "react-icons/fa";
import { CgUser } from "react-icons/cg";
import DropDown from "./DropDown";
import { HiMenu } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import MobileNavbar from "./MobileNavbar";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategoriesAction } from "../../Redux/Actions/CategoriesActions";
import { getFavoriteMoviesAction } from "../../Redux/Actions/userActions";

function Navbar() {
  const [search, setSearch] = useState("");
  const [mobileNavbarOpen, setMobileNavbarOpen] = useState(false);
  const { userInfo } = useSelector((state) => state.userLogin);
  const { likedMovies } = useSelector((state) => state.userGetFavoriteMovies);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // all categories
  const { categories } = useSelector((state) => state.categoryGetAll);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/movies/${search}`);
      setSearch(search);
    } else {
      navigate(`/movies`);
    }
  };
  useEffect(() => {
    // get all categories
    dispatch(getAllCategoriesAction());
    if (userInfo) {
      dispatch(getFavoriteMoviesAction());
    }
  }, [dispatch, userInfo]);
  const datas = {
    categories: categories,
  };

  const hover = "hover:text-subMain transition text-white";
  const Hover = ({ isAction }) => (isAction ? "text-subMain" : hover);
  const toggleMobileNavbar = () => {
    setMobileNavbarOpen(!mobileNavbarOpen);
  };
  const closeMobileNavbar = () => {
    setMobileNavbarOpen(!mobileNavbarOpen);
  };
  return (
    <>
      <div className="bg-navB shadow-md sticky top-0 z-20">
        {mobileNavbarOpen && (
          <MobileNavbar data={datas} closeMobileNavbar={closeMobileNavbar} />
        )}
        <div className="container mx-auto py-6 px-2 lg:grid flex lg:gap-10 lg:grid-cols-7 grid-cols-3 justify-between items-center">
          {/* Logo */}
          <div className="col-span-1">
            <Link to="/">
              <img
                src="/images/logo.png"
                alt="logo"
                className="w-full h-12 object-contain"
              />
            </Link>
          </div>
          {/* search Form */}
          <div className="col-span-2 max-lg:hidden">
            <form
              onSubmit={handleSearch}
              className="w-full text-sm bg-main rounded flex-btn gap-4"
            >
              <button
                type="submit"
                className="bg-main w-12 flex-colo h-12 rounded text-border"
              >
                <FaSearch />
              </button>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search: movie name, actor name...."
                className="font-medium placeholder:text-border focus:placeholder:text-white text-sm w-11/12 h-12 bg-transparent border-none px-2 text-white"
              />
            </form>
          </div>
          {/* menu */}
          <div className="col-span-4 font-medium text-sm hidden xl:gap-14 2xl:gap-20 justify-between lg:flex xl:justify-end items-center">
            <NavLink to="/movies" className={Hover}>
              Movies
            </NavLink>
            <DropDown
              style={`${hover} group-hover:text-subMain cursor-pointer relative`}
              data={datas}
            />
            <NavLink to="/about-us" className={Hover}>
              About Us
            </NavLink>
            <NavLink to="/contact-us" className={Hover}>
              Contact Us
            </NavLink>
            <NavLink
              to={
                userInfo?.isAdmin
                  ? "/dashboard"
                  : userInfo
                  ? "/profile"
                  : "/login"
              }
              className={Hover}
            >
              {userInfo ? (
                <img
                  src={userInfo?.image ? userInfo?.image : "/images/user.png"}
                  alt={userInfo?.fullName}
                  className="w-8 h-8 rounded-full border object-cover border-subMain"
                />
              ) : (
                <CgUser className="w-7 h-7" />
              )}
            </NavLink>
            {userInfo ? (
              <NavLink to="/favorites" className={`${Hover} relative`}>
                <FaHeart className="w-7 h-7" />
                <div className="w-4 h-4 flex-colo rounded-full text-xs bg-subMain text-white absolute -top-2 -right-2">
                  {likedMovies?.length}
                </div>
              </NavLink>
            ) : (
              <NavLink to="/login" className={`${Hover} relative`}>
                <FaHeart className="w-7 h-7" />
              </NavLink>
            )}
          </div>
          <div className="lg:hidden col-span-2 flex flex-row gap-5">
            <button
              type="submit"
              onClick={toggleMobileNavbar}
              className=" bg-navB w-12 flex-colo h-12 rounded text-white"
            >
              <FaSearch />
            </button>
            <button
              type="button"
              onClick={toggleMobileNavbar}
              className="transitions w-10 h-10 flex-colo text-base text-white bg-subMain rounded-sm hover:text-main m-auto"
            >
              {mobileNavbarOpen ? <IoClose /> : <HiMenu />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;

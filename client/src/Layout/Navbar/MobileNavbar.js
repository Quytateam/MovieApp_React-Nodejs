import React, { useState } from "react";
import { CgUser } from "react-icons/cg";
import { FaHeart, FaSearch } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { AiFillCaretDown } from "react-icons/ai";
import { AiFillCaretUp } from "react-icons/ai";
import { useSelector } from "react-redux";

function MobileNavbar({ datas, closeMobileNavbar, ...props }) {
  const [search, setSearch] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const { userInfo } = useSelector((state) => state.userLogin);
  const { likedMovies } = useSelector((state) => state.userGetFavoriteMovies);
  const { categories } = props?.data;
  const Filter = [
    {
      items:
        categories?.length > 0
          ? [...categories]
          : [{ title: "No category found" }],
      title: "Category",
    },
  ];
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/movies/${search}`);
      setSearch(search);
      closeMobileNavbar();
    } else {
      navigate(`/movies`);
      closeMobileNavbar();
    }
  };

  const active = "text-subMain";
  const inActive = "transition text-white";

  const Hover = ({ isActive }) => (isActive ? `${active}` : `${inActive}`);
  const toggleMobileNavbar = () => {
    setCategoryOpen(!categoryOpen);
  };
  return (
    <div className="absolute mt-24 bg-main h-screen -right-0 p-5 w-screen">
      <form
        onSubmit={handleSearch}
        className="w-full text-sm bg-white rounded flex-btn gap-4 mb-4"
      >
        <button
          type="submit"
          className="bg-white w-12 flex-colo h-12 rounded text-border"
        >
          <FaSearch />
        </button>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search: movie name, actor name...."
          className="font-medium placeholder:text-border focus:placeholder:text-dry text-sm w-11/12 h-12 bg-transparent border-none px-2 text-main"
        />
      </form>
      <div className="leading-10 flex flex-col">
        <NavLink to="/movies" className={Hover} onClick={closeMobileNavbar}>
          Movies
        </NavLink>
        {Filter.map((item, index) => (
          <div key={index}>
            <button
              onClick={toggleMobileNavbar}
              className={`${Hover} flex flex-row items-center gap-3 w-full`}
            >
              {item?.title}{" "}
              {categoryOpen ? <AiFillCaretUp /> : <AiFillCaretDown />}
            </button>
            {categoryOpen && (
              <div className="grid grid-cols-2 gap-0 gap-x-8 list-none border-t border-white">
                {item?.items?.map((data, index) => (
                  <li key={index} onClick={closeMobileNavbar}>
                    <NavLink
                      to={`/movies/genre/${data?.title}`}
                      className={Hover}
                    >
                      {data?.title}
                    </NavLink>
                  </li>
                ))}
              </div>
            )}
          </div>
        ))}
        <NavLink to="/about-us" className={Hover}>
          About Us
        </NavLink>
        <NavLink to="/contact-us" className={Hover}>
          Contact Us
        </NavLink>
        <NavLink
          to={
            userInfo?.isAdmin ? "/dashboard" : userInfo ? "/profile" : "/login"
          }
          className={`${Hover} mb-4`}
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
            <div className="w-4 h-4 flex-colo rounded-full text-xs bg-subMain text-white absolute -top-2 left-5">
              {likedMovies?.length}
            </div>
          </NavLink>
        ) : (
          <NavLink to="/login" className={`${Hover} relative`}>
            <FaHeart className="w-7 h-7" />
          </NavLink>
        )}
      </div>
    </div>
  );
}

export default MobileNavbar;

import React from "react";
import { NavLink } from "react-router-dom";

function DropDown({ style, ...props }) {
  const hover = "hover:text-subMain transition text-white";
  const Hover = ({ isAction }) => (isAction ? "text-subMain" : hover);
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
  return (
    <>
      {Filter.map((item, index) => (
        <div key={index} className="group relative">
          <span className={`${style}`}>{item?.title}</span>
          <ul
            className={`absolute hidden group-hover:block ${
              item.items?.length > 6 ? "w-80" : "w-auto"
            } mt-0 pt-11 pb-4 px-4 bg-navB rounded shadow-lg -ml-5`}
          >
            <div
              className={`${
                item.items?.length > 6
                  ? "grid grid-cols-3 gap-4 gap-x-8"
                  : "grid grid-flow-row leading-10"
              }`}
            >
              {item?.items
                ?.sort((a, b) => a?.title.localeCompare(b?.title))
                .map((data, index) => (
                  <li key={index}>
                    <NavLink
                      to={`/movies/genre/${data?.title}`}
                      className={Hover}
                    >
                      {data?.title}
                    </NavLink>
                  </li>
                ))}
            </div>
          </ul>
        </div>
      ))}
    </>
  );
}

export default DropDown;

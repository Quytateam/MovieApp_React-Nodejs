import React from "react";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  IfMovieLiked,
  LikeMovie,
  deleteFavoriteMovie,
} from "../Context/Functionalities";

function Movie({ movie }) {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.userLogin);
  const likedMovies = useSelector(
    (state) => state.userGetFavoriteMovies.likedMovies
  );

  // if liked function
  const isLiked = IfMovieLiked(movie, likedMovies);
  return (
    <>
      <div className="border border-border p-1 hover:scale-95 transitions relative rounded overflow-hidden">
        <Link to={`/movie/${movie?._id}`} className="w-full">
          <img
            src={movie?.image ? movie?.image : "/images/user.png"}
            alt={movie?.name}
            className="w-full h-64 object-cover"
          />
        </Link>
        <div className="absolute flex-btn gap-2 bottom-0 right-0 left-0 bg-main bg-opacity-0 text-white px-4 py-3">
          <h3 className="font-semibold truncate">{movie?.name}</h3>
          <button
            onClick={() =>
              isLiked
                ? deleteFavoriteMovie(movie, dispatch)
                : LikeMovie(movie, dispatch, userInfo)
            }
            className={`h-9 w-9 text-sm flex-colo transitions ${
              isLiked ? "bg-transparent text-subMain" : "bg-subMain text-white"
            } hover:bg-transparent border-2 border-subMain rounded-md`}
          >
            <FaHeart />
          </button>
        </div>
      </div>
    </>
  );
}

export default Movie;

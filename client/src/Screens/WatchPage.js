import React, { useContext, useEffect, useState } from "react";
import Layout from "../Layout/Layout";
import { Link, useParams } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { FaCloudDownloadAlt, FaHeart, FaPlay } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getMovieByIdAction } from "../Redux/Actions/MoviesActions";
import Loader from "../Components/Notfications/Loader";
import { RiMovie2Line } from "react-icons/ri";
import {
  DownloadVideo,
  IfMovieLiked,
  LikeMovie,
  deleteFavoriteMovie,
} from "../Context/Functionalities";
import FileSaver from "file-saver";
import { SidebarContext } from "../Context/DrawerContext";
import MovieRates from "../Components/Single/MovieRates";

function WatchPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [play, setPlay] = useState(false);
  const { progress, setProgress } = useContext(SidebarContext);
  const sameClass = "w-full gap-6 flex-colo min-h-screen";
  // use Selector
  const { isLoading, isError, movie } = useSelector(
    (state) => state.getMovieById
  );
  const { userInfo } = useSelector((state) => state.userLogin);
  const likedMovies = useSelector(
    (state) => state.userGetFavoriteMovies.likedMovies
  );

  // if liked function
  const isLiked = (movie) => IfMovieLiked(movie, likedMovies);

  // download movie video
  const DownloadMovieVideo = async (videoUrl, name) => {
    await DownloadVideo(videoUrl, setProgress).then((data) => {
      setProgress(0);
      FileSaver.saveAs(data, name);
    });
  };

  useEffect(() => {
    // movie id
    dispatch(getMovieByIdAction(id));
  }, [dispatch, id]);

  return (
    <Layout>
      <div className="container mx-auto bg-dry p-6 mb-12">
        {!isError && (
          <div className="flex-btn flex-wrap mb-6 gap-2 bg-main rounded border border-gray-800 p-6">
            {/* Back to movie */}
            <Link
              to={`/movie/${movie?._id}`}
              className="md:text-xl text-sm flex gap-3 items-center font-bold text-dryGray"
            >
              <BiArrowBack /> {movie?.name}
            </Link>
            <div className="flex-btn sm:w-auto w-full gap-5">
              <button
                onClick={() =>
                  isLiked(movie)
                    ? deleteFavoriteMovie(movie, dispatch)
                    : LikeMovie(movie, dispatch, userInfo)
                }
                // disabled={isLiked(movie) || likeLoading}
                className={`bg-white hover:text-subMain ${
                  isLiked(movie) ? "text-subMain" : "text-white"
                } transitions bg-opacity-30 rounded px-4 py-3 text-sm`}
              >
                <FaHeart />
              </button>
              <button
                disabled={(progress > 0 && progress < 100) || !movie?.video}
                onClick={() => DownloadMovieVideo(movie?.video, movie?.name)}
                className="bg-subMain flex-rows gap-2 hover:text-main transitions text-white rounded px-8 font-medium py-3 text-sm"
              >
                <FaCloudDownloadAlt /> Dowload
              </button>
            </div>
          </div>
        )}

        {/* watch video */}
        {play ? (
          <video controls autoPlay={play} className="w-full h-full rounded">
            <source src={movie?.video} type="video/mp4" title={movie?.name} />
          </video>
        ) : (
          <div className="w-full h-screen rounded-lg overflow-hidden relative">
            {isLoading ? (
              <div className={sameClass}>
                <Loader />
              </div>
            ) : isError ? (
              <div className={sameClass}>
                <div className="flex-colo w-24 h-24 p-5 mb-4 rounded-full bg-dry text-subMain text-4xl">
                  <RiMovie2Line />
                </div>
                <p className="text-border text-sm">{isError}</p>
              </div>
            ) : (
              <>
                <div className="absolute top-0 left-0 bottom-0 right-0 bg-black bg-opacity-30 flex-colo">
                  <button
                    onClick={() => setPlay(true)}
                    className="bg-white text-subMain flex-colo border border-subMain rounded-full w-20 h-20 font-medium text-xl"
                  >
                    <FaPlay />
                  </button>
                </div>
                <img
                  src={movie?.image ? movie?.image : "images/user.png"}
                  alt={movie?.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </>
            )}
          </div>
        )}
        <div className="container mx-auto min-h-full px-2 my-6">
          <MovieRates movie={movie} />
        </div>
      </div>
    </Layout>
  );
}

export default WatchPage;

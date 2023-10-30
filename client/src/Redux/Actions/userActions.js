import * as userConstants from "../Constants/userConstants";
import * as movieConstants from "../Constants/MoviesConstants";
import * as categoriesConstants from "../Constants/CategoriesConstants";
import * as userAPI from "../APIs/userServices";
import toast from "react-hot-toast";
import { ErrorsAction, tokenProtection } from "../Protection";

// login action
const loginAction = (datas) => async (dispatch) => {
  try {
    dispatch({ type: userConstants.USER_LOGIN_REQUEST });
    const response = await userAPI.loginService(datas);
    dispatch({ type: userConstants.USER_LOGIN_SUCCESS, payload: response });
  } catch (error) {
    ErrorsAction(error, dispatch, userConstants.USER_LOGIN_FAIL);
  }
};

// register action
const registerAction = (datas) => async (dispatch) => {
  try {
    dispatch({ type: userConstants.USER_REGISTER_REQUEST });
    const response = await userAPI.registerService(datas);
    dispatch({ type: userConstants.USER_REGISTER_SUCCESS, payload: response });
    dispatch({ type: userConstants.USER_LOGIN_SUCCESS, payload: response });
  } catch (error) {
    ErrorsAction(error, dispatch, userConstants.USER_REGISTER_FAIL);
  }
};

// logout action
const logoutAction = () => (dispatch) => {
  userAPI.logoutService();
  dispatch({ type: userConstants.USER_LOGOUT });
  dispatch({ type: userConstants.USER_LOGIN_RESET });
  dispatch({ type: userConstants.USER_REGISTER_RESET });
  dispatch({ type: userConstants.DELETE_FAVORITE_MOVIES_RESET });
  dispatch({ type: userConstants.USER_UPDATE_PROFILE_RESET });
  dispatch({ type: userConstants.USER_DELETE_PROFILE_RESET });
  dispatch({ type: userConstants.USER_CHANGE_PASSWORD_RESET });
  dispatch({ type: userConstants.GET_FAVORITE_MOVIES_RESET });
  dispatch({ type: userConstants.GET_ALL_USERS_RESET });
  dispatch({ type: userConstants.DELETE_USER_RESET });
  dispatch({ type: userConstants.LIKE_MOVIE_RESET });
  dispatch({ type: movieConstants.MOVIE_DETAILS_RESET });
  dispatch({ type: movieConstants.CREATE_REVIEW_RESET });
  dispatch({ type: movieConstants.CREATE_MOVIE_RESET });
  dispatch({ type: movieConstants.RESET_CAST });
  dispatch({ type: movieConstants.UPDATE_MOVIE_RESET });
  dispatch({ type: categoriesConstants.CREATE_CATEGORY_RESET });
  dispatch({ type: categoriesConstants.UPDATE_CATEGORY_RESET });
  dispatch({ type: categoriesConstants.DELETE_CATEGORY_RESET });
};

// update profile action
const updateProfileAction = (user) => async (dispatch, getState) => {
  try {
    dispatch({ type: userConstants.USER_UPDATE_PROFILE_REQUEST });
    const response = await userAPI.updateProfileService(
      user,
      tokenProtection(getState)
    );
    dispatch({
      type: userConstants.USER_UPDATE_PROFILE_SUCCESS,
      payload: response,
    });
    toast.success("Personal profile updated");
    dispatch({ type: userConstants.USER_LOGIN_SUCCESS, payload: response });
  } catch (error) {
    ErrorsAction(error, dispatch, userConstants.USER_UPDATE_PROFILE_FAIL);
  }
};

// delete profile action
const deleteProfileAction = () => async (dispatch, getState) => {
  try {
    dispatch({ type: userConstants.USER_DELETE_PROFILE_REQUEST });
    await userAPI.deleteProfileService(tokenProtection(getState));
    dispatch({ type: userConstants.USER_DELETE_PROFILE_SUCCESS });
    toast.success("Your profile deleted");
    dispatch(logoutAction());
  } catch (error) {
    ErrorsAction(error, dispatch, userConstants.USER_DELETE_PROFILE_FAIL);
  }
};

// change password action
const changePasswordAction = (passwords) => async (dispatch, getState) => {
  try {
    dispatch({ type: userConstants.USER_CHANGE_PASSWORD_REQUEST });
    const response = await userAPI.changePasswordService(
      passwords,
      tokenProtection(getState)
    );
    dispatch({
      type: userConstants.USER_CHANGE_PASSWORD_SUCCESS,
      payload: response,
    });
    toast.success("Password has been changed");
    dispatch(logoutAction());
  } catch (error) {
    ErrorsAction(error, dispatch, userConstants.USER_CHANGE_PASSWORD_FAIL);
  }
};

// get all favorite movies action
const getFavoriteMoviesAction = () => async (dispatch, getState) => {
  try {
    dispatch({ type: userConstants.GET_FAVORITE_MOVIES_REQUEST });
    const response = await userAPI.getFavoriteMovies(tokenProtection(getState));
    dispatch({
      type: userConstants.GET_FAVORITE_MOVIES_SUCCESS,
      payload: response,
    });
  } catch (error) {
    ErrorsAction(error, dispatch, userConstants.GET_FAVORITE_MOVIES_FAIL);
  }
};

// delete all favorite movies action
const deleteFavoriteMoviesAction = () => async (dispatch, getState) => {
  try {
    dispatch({ type: userConstants.DELETE_FAVORITE_MOVIES_REQUEST });
    await userAPI.deleteFavoriteMovies(tokenProtection(getState));
    dispatch({ type: userConstants.DELETE_FAVORITE_MOVIES_SUCCESS });
    toast.success("All your favorite movie has been deleted");
  } catch (error) {
    ErrorsAction(error, dispatch, userConstants.DELETE_FAVORITE_MOVIES_FAIL);
  }
};

// admin get all users action
const getAllUsersAction = () => async (dispatch, getState) => {
  try {
    dispatch({ type: userConstants.GET_ALL_USERS_REQUEST });
    const response = await userAPI.getAllUsersService(
      tokenProtection(getState)
    );
    dispatch({
      type: userConstants.GET_ALL_USERS_SUCCESS,
      payload: response,
    });
  } catch (error) {
    ErrorsAction(error, dispatch, userConstants.GET_ALL_USERS_FAIL);
  }
};

// admin delete user action
const deleteUserAction = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: userConstants.DELETE_USER_REQUEST });
    await userAPI.deleteUsersService(id, tokenProtection(getState));
    dispatch({ type: userConstants.DELETE_USER_SUCCESS });
    toast.success("This user account has been deleted");
  } catch (error) {
    ErrorsAction(error, dispatch, userConstants.DELETE_USER_FAIL);
  }
};

// user like movie action
const likeMovieAction = (movieId) => async (dispatch, getState) => {
  try {
    dispatch({ type: userConstants.LIKE_MOVIE_REQUEST });
    const response = await userAPI.likeMovieService(
      movieId,
      tokenProtection(getState)
    );
    dispatch({ type: userConstants.LIKE_MOVIE_SUCCESS, payload: response });
    toast.success("Added to your favorites");
    dispatch(getFavoriteMoviesAction());
  } catch (error) {
    ErrorsAction(error, dispatch, userConstants.LIKE_MOVIE_FAIL);
  }
};

// delete favorite movies action
const deleteFavoriteMovieAction = (movieId) => async (dispatch, getState) => {
  try {
    dispatch({ type: userConstants.DELETE_FAVORITE_MOVIE_REQUEST });
    await userAPI.deleteFavoriteMovie(movieId, tokenProtection(getState));
    dispatch({ type: userConstants.DELETE_FAVORITE_MOVIE_SUCCESS });
    toast.success("Favorite movie has been deleted");
    dispatch(getFavoriteMoviesAction());
  } catch (error) {
    ErrorsAction(error, dispatch, userConstants.DELETE_FAVORITE_MOVIE_FAIL);
  }
};

export {
  loginAction,
  registerAction,
  logoutAction,
  updateProfileAction,
  deleteProfileAction,
  changePasswordAction,
  getFavoriteMoviesAction,
  deleteFavoriteMoviesAction,
  getAllUsersAction,
  deleteUserAction,
  likeMovieAction,
  deleteFavoriteMovieAction,
};

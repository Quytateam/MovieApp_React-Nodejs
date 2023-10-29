import asyncHandler from "express-async-handler";
import Movie from "../models/MoviesModel.js";
import bcrypt from "bcryptjs";
import { MoviesData } from "../data/MovieData.js";

// ******** PUBLIC CONTROLLERS ***********
// @desc import movies
// @route POST /api/movies/import
// @access Public
const importMovies = asyncHandler(async (req, res) => {
  await Movie.deleteMany({});
  const movies = await Movie.insertMany(MoviesData);
  res.status(201).json(movies);
});

// @desc get all movies
// @route GET /api/movies
// @access Public
const getMovies = asyncHandler(async (req, res) => {
  try {
    // Lọc phim theo thể loại, thời lượng , ngôn ngữ, tỉ lệ, năm
    const { category, time, language, rate, year, search } = req.query;
    let query = {
      ...(category && { category }),
      ...(time && { time }),
      ...(language && { language }),
      ...(rate && { rate }),
      ...(year && { year }),
      ...(search && { name: { $regex: search, $options: "i" } }),
    };

    // load more movies functionallity (tải thêm chức năng phim)
    const page = Number(req.query.pageNumber) || 1; // Nếu không có phim được cung cấp thì số trang là 1
    const limit = 10; // Giới hạn số phim mỗi trang
    const skip = (page - 1) * limit; // nhảy n phim mỗi trang

    // find movie by query, skip and limit
    const movies = await Movie.find(query)
      // .sort({ createAt: -1 })
      .skip(skip)
      .limit(limit);

    // get total number of movie (lấy tổng số phim)
    const count = await Movie.countDocuments(query);

    // send response with movies and total number of movies (gửi phản hồi với phim và tổng số phim)
    res.json({
      movies,
      page,
      pages: Math.ceil(count / limit),
      totalMovies: count,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc get movie by id
// @route GET /api/movies/:id
// @access Public
const getMovieById = asyncHandler(async (req, res) => {
  try {
    // Tìm phim theo id trong database
    const movie = await Movie.findById(req.params.id);
    // Nếu tìm thấy => gửi lên máy chủ
    if (movie) {
      res.json(movie);
    }
    //Nếu không tìm thấy
    else {
      res.status(404);
      throw new Error("Không tìm thấy phim");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc get top rate movie
// @route GET /api/movies/rated/top
// @access Public
const getTopRatedMovies = asyncHandler(async (req, res) => {
  try {
    // Tìm phim có tỉ lệ cao
    const movies = await Movie.find({}).sort({ rate: -1 });
    // Gửi tỉ lệ phim lên máy chủ
    res.json(movies);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc get random movie
// @route GET /api/movies/random/all
// @access Public
const getRandomMovies = asyncHandler(async (req, res) => {
  try {
    // Tìm phim ngẫu nhiên
    const movies = await Movie.aggregate([{ $sample: { size: 8 } }]);
    // Gửi phim ngẫu nhiên lên máy chủ
    res.json(movies);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ******** PRIVATE CONTROLLERS ***********
// @desc create movie review
// @route GET /api/movies/:id/reviews
// @access Private
const createMovieReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  try {
    // Tìm phim theo id trong database
    const movie = await Movie.findById(req.params.id);
    // Nếu tìm thấy => gửi lên máy chủ
    if (movie) {
      //Kiểm tra có người dùng đã đánh giá bộ phim này
      const alreadyReviewed = movie.reviews.find(
        (r) => r.userId.toString() === req.user._id.toString()
      );
      // Nếu đã có người bình luận
      if (alreadyReviewed) {
        res.status(400);
        throw new Error("You have already commented on this movie");
      }
      const review = {
        userName: req.user.fullName,
        userId: req.user._id,
        userImage: req.user.image,
        rating: Number(rating),
        comment,
      };
      // Thêm bình luận mới
      movie.reviews.push(review);
      // Tăng số lượng đếm của bình luận
      movie.numberOfReviews = movie.reviews.length;

      // Tính tỉ lệ mới
      movie.rate =
        movie.reviews.reduce((acc, item) => item.rating + acc, 0) /
        movie.reviews.length;

      // Lưu lại
      await movie.save();
      // Truyền lên client
      res.status(201).json({ message: "Đã thêm bình luận" });
    }
    //Nếu không tìm thấy
    else {
      res.status(404);
      throw new Error("Không tìm thấy phim");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc delete movie review
// @route DELETE /api/movies/:id/reviews
// @access Private
const deleteMovieReview = asyncHandler(async (req, res) => {
  try {
    // Tìm phim theo id trong database
    const movie = await Movie.findById(req.params.id);
    // Nếu tìm thấy => gửi lên máy chủ
    // res.send(movie.reviews);
    if (movie) {
      //Kiểm tra có người dùng đã đánh giá bộ phim này
      const alreadyReviewed = movie.reviews.find(
        (r) => r.userId.toString() === req.user._id.toString()
      );

      await alreadyReviewed.deleteOne();

      // Tăng số lượng đếm của bình luận
      movie.numberOfReviews = movie.reviews.length;
      // Tính tỉ lệ mới
      movie.rate = movie.reviews.length
        ? movie.reviews.reduce((acc, item) => item.rating + acc, 0) /
          movie.reviews.length
        : 0;

      // Lưu lại
      await movie.save();
      // Truyền lên client
      res.json({ message: "Bình luận của bạn đã xóa" });
    }
    //Nếu không tìm thấy
    else {
      res.status(404);
      throw new Error("Không tìm thấy phim");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ******** ADMIN CONTROLLERS ***********
// @desc Update movie
// @route PUT /api/movies/:id/
// @access Private/Admin
const updateMovie = asyncHandler(async (req, res) => {
  try {
    // Lấy dữ liệu phản hồi từ body
    const {
      name,
      desc,
      image,
      titleImage,
      rate,
      numberOfReviews,
      category,
      time,
      language,
      year,
      video,
      casts,
    } = req.body;

    // Tìm phim theo id trong database
    const movie = await Movie.findById(req.params.id);
    // Nếu tìm thấy => gửi lên máy chủ
    if (movie) {
      // update movie data
      movie.name = name || movie.name;
      movie.desc = desc || movie.desc;
      movie.image = image || movie.image;
      movie.titleImage = titleImage || movie.titleImage;
      movie.rate = rate || movie.rate;
      movie.numberOfReviews = numberOfReviews || movie.numberOfReviews;
      movie.category = category || movie.category;
      movie.time = time || movie.time;
      movie.language = language || movie.language;
      movie.year = year || movie.year;
      movie.video = video || movie.video;
      movie.casts = casts || movie.casts;

      // Lưu phim vào db
      const updatedMovie = await movie.save();
      // Gửi phản hồi
      res.status(201).json(updatedMovie);
    } else {
      res.status(404);
      throw new Error("Không tìm thấy phim");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc Delete movie
// @route DELETE /api/movies/:id/
// @access Private/Admin
const deleteMovie = asyncHandler(async (req, res) => {
  try {
    // Tìm phim theo id trong database
    const movie = await Movie.findById(req.params.id);
    // Nếu tìm thấy => xoá phim
    if (movie) {
      await movie.deleteOne();
      res.json({ message: "Phim đã được xóa" });
    } else {
      res.status(404);
      throw new Error("Không tìm thấy phim");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc Delete all movies
// @route DELETE /api/movies
// @access Private/Admin
const deleteAllMovies = asyncHandler(async (req, res) => {
  try {
    // Xóa tất cả phim
    await Movie.deleteMany({});
    res.json({ message: "Tất cả phim đã xóa hết" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc Create movie
// @route POST /api/movies
// @access Private/Admin
const createMovie = asyncHandler(async (req, res) => {
  try {
    // Lấy dữ liệu phản hồi từ body
    const {
      name,
      desc,
      image,
      titleImage,
      rate,
      numberOfReviews,
      category,
      time,
      language,
      year,
      video,
      casts,
    } = req.body;

    // create a new movie
    const movie = new Movie({
      name,
      desc,
      image,
      titleImage,
      rate,
      numberOfReviews,
      category,
      time,
      language,
      year,
      video,
      casts,
      userId: req.user._id,
    });

    // Lưu phim vào db
    if (movie) {
      const createdMovie = await movie.save();
      res.status(201).json(createdMovie);
    } else {
      res.status(404);
      throw new Error("Dữ liệu phim không hợp lệ");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export {
  importMovies,
  getMovies,
  getMovieById,
  getTopRatedMovies,
  getRandomMovies,
  createMovieReview,
  deleteMovieReview,
  updateMovie,
  deleteMovie,
  deleteAllMovies,
  createMovie,
};

const Tour = require("./../models/tourModel");

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (tour) {
      res.status(200).json({
        message: "success",
        data: {
          tour: tour,
        },
      });
    }
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: "Error while getting tour",
    });
  }
};

exports.getAlltour = async (req, res) => {
  try {
    console.log(req.query);
    // Filtering

    const queryObj = { ...req.query };
    const excluedFields = ["page", "sort", "limit", "fields"];
    excluedFields.forEach((el) => delete queryObj[el]);

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = Tour.find(JSON.parse(queryStr));

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Field Limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // Pagination
    const page = req.query.page * 1 || 1
    const limit = req.query.limit * 1 || 50
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit)


    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      const total = numTours / req.query.page * 1
      if (skip >= numTours) throw new Error("This page does not exists")
    }


    // Execute Query
    const tours = await query;

    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        allTour: tours,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "invalid data sent",
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "Deleted tour successfully",
      result: tour,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "invalid data sent",
    });
  }
};
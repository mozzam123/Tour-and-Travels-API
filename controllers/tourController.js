const Tour = require("./../models/tourModel");
const APIFeatures = require("./../utils/apiFeatures")


// Middleware
exports.AliasTopTours = async (req, res, next) => {
  req.query.limit = '5'
  req.query.sort = '-ratingsAverage,price'
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
  next();
}


// Get Single Tour
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

// Get All Tour
exports.getAlltour = async (req, res) => {
  try {

    // Execute Query
    const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate()
    const tours = await features.query;

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

// Create Tour
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

// Update Tour
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

// Delete Tour
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

exports.getTourStat = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: {
          ratingsAverage: { $gte: 3 },
          price: {$eq : 55}
        }
      },

      // {
      //   $group: {
      //     _id: null,
      //     avgRating: { $avg: '$ratingsAverage' }
      //   }
      // }

    ])
    res.json({ result: stats })

  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
}

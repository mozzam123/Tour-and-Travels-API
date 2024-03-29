const express = require('express');
const router = express.Router();
const tourController = require('./../controllers/tourController');


// router.param('id', tourController.checkINT);
// router.param('id', tourController.checkID);
// router.use(tourController.checkBody)

// Get top 
// router.route('/top-5-cheap').get(tourController.AliasTopTours, tourController.getAlltour)
router.route('/top-5-cheap').get(tourController.getTourStat)

router
  .route('/')
  .get(tourController.getAlltour)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .post(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;

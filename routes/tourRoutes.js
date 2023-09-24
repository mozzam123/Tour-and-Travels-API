const express = require('express');
const router = express.Router();
const tourController = require('./../controllers/tourController');


// router.param('id', tourController.checkINT);
// router.param('id', tourController.checkID);
// router.use(tourController.checkBody)

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

const express = require("express");

const requireAuth = require("../middleware/requireAuth");
const uploadListingImages = require("../middleware/uploadListingImages");

const {
  createListing,
  getListings,
  getMyListings,
  getListingById,
  updateListing,
  deleteListing,
} = require("../controllers/listingController");

const router = express.Router();

/*
 * GET /api/listings
 *
 * Public route that returns active marketplace listings.
 */
router.get("/", getListings);

router.get(
  "/mine",
  requireAuth,
  getMyListings
);

router.patch(
  "/:listingId",
  requireAuth,
  updateListing
);

router.delete(
  "/:listingId",
  requireAuth,
  deleteListing
);

/*
 * GET /api/listings/:listingId
 *
 * Public route that returns one listing by its MongoDB ID.
 */
router.get("/:listingId", getListingById);

/*
 * POST /api/listings
 *
 * Protected route that creates a listing for the
 * currently authenticated user.
 */
router.post(
  "/",
  requireAuth,
  uploadListingImages.single("image"),
  createListing
);

module.exports = router;
const mongoose = require("mongoose");

const Listing = require("../models/Listing");

/*
 * Removes spaces, parentheses, hyphens, and other formatting
 * from a phone number before it is stored.
 *
 * Example:
 * (407) 555-1234 -> 4075551234
 */
function normalizePhone(phone) {
  if (typeof phone !== "string") {
    return "";
  }

  return phone.replace(/\D/g, "");
}

function parseStringArray(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value !== "string") {
    return [];
  }

  try {
    const parsedValue = JSON.parse(value);

    return Array.isArray(parsedValue)
      ? parsedValue
      : [];
  } catch {
    return [];
  }
}

/*
 * Converts a Mongoose validation error into one readable message.
 */
function getValidationMessage(error) {
  const messages = Object.values(error.errors || {}).map(
    (validationError) => validationError.message
  );

  return messages[0] || "The listing information is invalid.";
}

/*
 * POST /api/listings
 *
 * Creates a marketplace listing for the authenticated user.
 *
 * This route must use requireAuth before calling this controller.
 */
async function createListing(req, res) {
  try {
    const {
      title,
      price,
      category,
      condition,
      description,
      contactPhone,
      zipCode,
    } = req.body;

    /*
     * requireAuth places the logged-in user's MongoDB ID at:
     *
     * req.auth.userId
     */
    const sellerId = req.auth?.userId;

    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: "Authentication is required.",
      });
    }

    const normalizedTitle =
      typeof title === "string" ? title.trim() : "";

    const normalizedCategory =
      typeof category === "string" ? category.trim() : "";

    const normalizedCondition =
      typeof condition === "string" ? condition.trim() : "";

    const normalizedDescription =
      typeof description === "string"
        ? description.trim()
        : "";

    const normalizedPhone = normalizePhone(contactPhone);

    const normalizedZipCode =
      typeof zipCode === "string" ? zipCode.trim() : "";

    /*
     * Number("") becomes 0, so check for an empty value before
     * converting the submitted price.
     */
    if (
      price === undefined ||
      price === null ||
      String(price).trim() === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Price is required.",
      });
    }

    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice)) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid number.",
      });
    }

    const normalizedImages = req.file
      ? [`/uploads/listings/${req.file.filename}`]
      : [];

    const listing = await Listing.create({
      seller: sellerId,
    
      title: normalizedTitle,
      price: numericPrice,
      category: normalizedCategory,
      condition: normalizedCondition,
      description: normalizedDescription,
    
      images: normalizedImages,
    
      contactPhone: normalizedPhone,
      zipCode: normalizedZipCode,
    
      paymentMethods: parseStringArray(
        req.body.paymentMethods
      ),
      
      meetupLocations: parseStringArray(
        req.body.meetupLocations
      ),
      
      buyerInformation:
        typeof req.body.buyerInformation === "string"
          ? req.body.buyerInformation.trim()
          : "",
    
      city:
        typeof req.body.city === "string"
          ? req.body.city.trim()
          : "",
    
      state:
        typeof req.body.state === "string"
          ? req.body.state.trim()
          : "",
    
      stateAbbreviation:
        typeof req.body.stateAbbreviation === "string"
          ? req.body.stateAbbreviation.trim()
          : "",
    
      latitude: Number(req.body.latitude),
    
      longitude: Number(req.body.longitude),
    });

    /*
     * Add public seller information to the response without
     * duplicating it inside the Listing document.
     */
    await listing.populate(
      "seller",
      "displayName profilePicture verifiedStudent"
    );

    return res.status(201).json({
      success: true,
      message: "Listing created successfully.",
      listing,
    });
  } catch (error) {
    if (error?.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: getValidationMessage(error),
      });
    }

    if (error?.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "The listing information contains an invalid value.",
      });
    }

    console.error("Create listing error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create the listing.",
    });
  }
}

/*
 * GET /api/listings
 *
 * Returns active marketplace listings, newest first.
 *
 * Query examples:
 * /api/listings
 * /api/listings?page=2
 * /api/listings?page=1&limit=20
 */
async function getListings(req, res) {
  try {
    const requestedPage = Number.parseInt(req.query.page, 10);
    const requestedLimit = Number.parseInt(req.query.limit, 10);

    const page =
      Number.isInteger(requestedPage) && requestedPage > 0
        ? requestedPage
        : 1;

    /*
     * Prevent one request from retrieving an excessive number
     * of listings.
     */
    const limit =
      Number.isInteger(requestedLimit) && requestedLimit > 0
        ? Math.min(requestedLimit, 50)
        : 12;

    const skip = (page - 1) * limit;

    const filter = {
      status: "active",
    };

    const [listings, totalListings] = await Promise.all([
      Listing.find(filter)
        .populate(
          "seller",
          "displayName profilePicture verifiedStudent"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      Listing.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalListings / limit);

    return res.status(200).json({
      success: true,
      listings,
      pagination: {
        page,
        limit,
        totalListings,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
      },
    });
  } catch (error) {
    console.error("Get listings error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve listings.",
    });
  }
}

/*
 * GET /api/listings/:listingId
 *
 * Returns one listing by its MongoDB ID.
 *
 * Removed listings are not publicly accessible.
 */
async function getListingById(req, res) {
  try {
    const { listingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid listing ID.",
      });
    }

    const listing = await Listing.findOne({
      _id: listingId,
      status: {
        $ne: "removed",
      },
    })
      .populate(
        "seller",
        "displayName profilePicture verifiedStudent"
      )
      .lean();

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found.",
      });
    }

    return res.status(200).json({
      success: true,
      listing,
    });
  } catch (error) {
    console.error("Get listing error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve the listing.",
    });
  }
}

/*
 * GET /api/listings/mine
 *
 * Returns only active listings owned by the authenticated user.
 */
async function getMyListings(req, res) {
  try {
    const sellerId = req.auth?.userId;

    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: "Authentication is required.",
      });
    }

    const listings = await Listing.find({
      seller: sellerId,
      status: "active",
    })
      .sort({
        createdAt: -1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      listings,
    });
  } catch (error) {
    console.error("Get my listings error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve your listings.",
    });
  }
}

/*
 * PATCH /api/listings/:listingId
 *
 * Updates a listing only when it belongs to the
 * authenticated user.
 */
async function updateListing(req, res) {
  try {
    const { listingId } = req.params;
    const sellerId = req.auth?.userId;

    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: "Authentication is required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid listing ID.",
      });
    }

    const listing = await Listing.findOne({
      _id: listingId,
      seller: sellerId,
      status: "active",
    });

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found.",
      });
    }

    const {
      title,
      price,
      category,
      condition,
      description,
    } = req.body;

    if (typeof title === "string") {
      listing.title = title.trim();
    }

    if (
      price !== undefined &&
      price !== null &&
      String(price).trim() !== ""
    ) {
      const numericPrice = Number(price);

      if (!Number.isFinite(numericPrice)) {
        return res.status(400).json({
          success: false,
          message: "Price must be a valid number.",
        });
      }

      listing.price = numericPrice;
    }

    if (typeof category === "string") {
      listing.category = category.trim();
    }

    if (typeof condition === "string") {
      listing.condition = condition.trim();
    }

    if (typeof description === "string") {
      listing.description = description.trim();
    }

    await listing.save();

    return res.status(200).json({
      success: true,
      message: "Listing updated successfully.",
      listing,
    });
  } catch (error) {
    if (error?.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: getValidationMessage(error),
      });
    }

    console.error("Update listing error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update the listing.",
    });
  }
}

/*
 * DELETE /api/listings/:listingId
 *
 * Permanently deletes a listing only when it belongs
 * to the authenticated user.
 */
async function deleteListing(req, res) {
  try {
    const { listingId } = req.params;
    const sellerId = req.auth?.userId;

    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: "Authentication is required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid listing ID.",
      });
    }

    const listing = await Listing.findOneAndDelete({
      _id: listingId,
      seller: sellerId,
    });

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Listing deleted successfully.",
    });
  } catch (error) {
    console.error("Delete listing error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete the listing.",
    });
  }
}

module.exports = {
  createListing,
  getListings,
  getMyListings,
  getListingById,
  updateListing,
  deleteListing,
};
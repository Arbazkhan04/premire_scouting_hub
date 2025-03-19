const getExpiryDate = (subscriptionPlan) => {
//   "trial", "monthly", "six_months", "yearly";
  const expiryDate = new Date();
  switch (subscriptionPlan) {
    case "trial":
      // Set trial expiry date (7 days from now)
      expiryDate.setDate(expiryDate.getDate() + 7);
      break;

    case "monthly":
      // Set trial expiry date (30 days from now)
      expiryDate.setDate(expiryDate.getDate() + 30);
      break;

    case "six_months":
      // Set trial expiry date (180 days from now)
      expiryDate.setDate(expiryDate.getDate() + 180);
      break;

    case "yearly":
      // Set trial expiry date (360 days from now)
      expiryDate.setDate(expiryDate.getDate() + 360);
      break;
    default:
      break;
  }

  return expiryDate;
};

module.exports = { getExpiryDate };

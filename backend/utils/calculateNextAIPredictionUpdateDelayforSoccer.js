const calculateNextUpdateDelay = (startTime) => {
    const now = new Date();
    const matchTime = new Date(startTime);
    const timeDiff = matchTime - now; // Time difference in milliseconds
  
    // If match starts in <= 24 hours, update every 5 hours
    if (timeDiff <= 24 * 60 * 60 * 1000) {
      return 5 * 60 * 60 * 1000; // 5 hours
    }
  
    // If match starts in > 24 hours but <= 5 days, update every 24 hours
    if (timeDiff <= 5 * 24 * 60 * 60 * 1000) {
      return 24 * 60 * 60 * 1000; // 24 hours
    }
  
    // If match starts in > 5 days, no further updates
    return null; // No delay (stop scheduling updates)
  };

  
  module.exports = calculateNextUpdateDelay;
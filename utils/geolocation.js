/**
 * Calculate distance between two points using Haversine formula
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in meters
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}

/**
 * Check if student is within acceptable range of teacher
 * @param {object} teacherLocation - {latitude, longitude}
 * @param {object} studentLocation - {latitude, longitude}
 * @param {number} maxDistance - Maximum acceptable distance in meters (default: 50)
 * @returns {object} {isWithinRange: boolean, distance: number}
 */
function isWithinRange(teacherLocation, studentLocation, maxDistance = 50) {
    const distance = calculateDistance(
        teacherLocation.latitude,
        teacherLocation.longitude,
        studentLocation.latitude,
        studentLocation.longitude
    );

    return {
        isWithinRange: distance <= maxDistance,
        distance: Math.round(distance)
    };
}

module.exports = {
    calculateDistance,
    isWithinRange
};

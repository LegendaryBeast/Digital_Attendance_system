/**
 * LocationService - Single Responsibility: Location validation and distance calculation
 * Extracted from attendance route for better separation of concerns
 */
class LocationService {
    /**
     * Calculate distance between two coordinates using Haversine formula
     * @param {Object} coord1 - { latitude, longitude }
     * @param {Object} coord2 - { latitude, longitude }
     * @returns {number} Distance in meters
     */
    calculateDistance(coord1, coord2) {
        const R = 6371e3; // Earth's radius in meters
        const φ1 = this.toRadians(coord1.latitude);
        const φ2 = this.toRadians(coord2.latitude);
        const Δφ = this.toRadians(coord2.latitude - coord1.latitude);
        const Δλ = this.toRadians(coord2.longitude - coord1.longitude);

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return Math.round(R * c);
    }

    /**
     * Convert degrees to radians
     * @param {number} degrees 
     * @returns {number}
     */
    toRadians(degrees) {
        return degrees * Math.PI / 180;
    }

    /**
     * Check if location is within acceptable range
     * @param {Object} teacherLocation 
     * @param {Object} studentLocation 
     * @param {number} maxDistance - Maximum allowed distance in meters
     * @returns {Object} { isWithinRange: boolean, distance: number }
     */
    validateLocation(teacherLocation, studentLocation, maxDistance = 50) {
        const distance = this.calculateDistance(teacherLocation, studentLocation);

        return {
            isWithinRange: distance <= maxDistance,
            distance
        };
    }
}

module.exports = LocationService;

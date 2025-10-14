import Hospital from "../model/hospital.model.js";

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {Number} lat1 - Latitude of point 1
 * @param {Number} lon1 - Longitude of point 1
 * @param {Number} lat2 - Latitude of point 2
 * @param {Number} lon2 - Longitude of point 2
 * @returns {Number} Distance in kilometers
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
};

const toRad = (value) => {
  return (value * Math.PI) / 180;
};

/**
 * Find nearby hospitals with specific equipment
 * @param {Number} longitude - Longitude coordinate
 * @param {Number} latitude - Latitude coordinate
 * @param {String} equipmentName - Name of equipment needed
 * @param {Number} maxDistance - Maximum distance in meters (default: 50000 = 50km)
 * @returns {Array} Array of hospitals with the equipment
 */
const findNearbyHospitalsWithEquipment = async (
  longitude, 
  latitude, 
  equipmentName, 
  maxDistance = 50000
) => {
  try {
    // Use MongoDB geospatial query
    const hospitals = await Hospital.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: maxDistance
        }
      },
      'equipments.name': { 
        $regex: new RegExp(equipmentName, 'i') 
      },
      'equipments.free': { $gt: 0 }
    }).select('name type address location equipments');

    // Filter and format results
    const results = hospitals.map(hospital => {
      const equipment = hospital.equipments.find(
        eq => eq.name.toLowerCase() === equipmentName.toLowerCase()
      );

      const distance = calculateDistance(
        latitude,
        longitude,
        hospital.location.coordinates[1],
        hospital.location.coordinates[0]
      );

      return {
        hospitalId: hospital._id,
        name: hospital.name,
        type: hospital.type,
        address: hospital.address,
        distance: distance.toFixed(2) + ' km',
        availableEquipment: {
          name: equipment.name,
          free: equipment.free,
          total: equipment.total
        }
      };
    });

    return results;
  } catch (error) {
    throw new Error(`Error finding nearby hospitals: ${error.message}`);
  }
};

/**
 * Find hospitals within radius
 * @param {Number} longitude - Longitude coordinate
 * @param {Number} latitude - Latitude coordinate
 * @param {Number} radiusInKm - Radius in kilometers
 * @returns {Array} Array of nearby hospitals
 */
const findHospitalsWithinRadius = async (longitude, latitude, radiusInKm = 10) => {
  try {
    const radiusInMeters = radiusInKm * 1000;

    const hospitals = await Hospital.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: radiusInMeters
        }
      }
    }).select('name type address location');

    return hospitals.map(hospital => {
      const distance = calculateDistance(
        latitude,
        longitude,
        hospital.location.coordinates[1],
        hospital.location.coordinates[0]
      );

      return {
        ...hospital.toObject(),
        distance: distance.toFixed(2) + ' km'
      };
    });
  } catch (error) {
    throw new Error(`Error finding hospitals within radius: ${error.message}`);
  }
};

export default {
  calculateDistance,
  findNearbyHospitalsWithEquipment,
  findHospitalsWithinRadius
};
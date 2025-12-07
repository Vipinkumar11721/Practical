const titles = [
  "Cozy Beachfront Cottage",
  "Modern Loft in Downtown",
  "Mountain Retreat",
  "Historic Villa in Tuscany",
  "Secluded Treehouse Getaway",
  "Beachfront Paradise",
  "Rustic Cabin by the Lake",
  "Luxury Penthouse with City Views",
  "Ski-In/Ski-Out Chalet",
  "Safari Lodge in the Serengeti"
];

const descriptions = [
  "Escape to this charming place for a relaxing getaway.",
  "Enjoy stunning views and easy access to attractions.",
  "Perfect for urban explorers and nature lovers alike.",
  "Unplug and unwind in this peaceful retreat.",
  "Experience the charm of the local area."
];

const imagePool = [
  "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1505691723518-36a66b59d9bd?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?auto=format&fit=crop&w=1200&q=80"
];

const locations = [
  { name: "Malibu", country: "United States", coord: { lat: 34.0259, lng: -118.7798 } },
  { name: "New York City", country: "United States", coord: { lat: 40.7128, lng: -74.006 } },
  { name: "Aspen", country: "United States", coord: { lat: 39.1911, lng: -106.8175 } },
  { name: "Florence", country: "Italy", coord: { lat: 43.7696, lng: 11.2558 } },
  { name: "Portland", country: "United States", coord: { lat: 45.5051, lng: -122.675 } },
  { name: "Cancun", country: "Mexico", coord: { lat: 21.1619, lng: -86.8515 } },
  { name: "Lake Tahoe", country: "United States", coord: { lat: 39.0968, lng: -120.0324 } },
  { name: "Los Angeles", country: "United States", coord: { lat: 34.0522, lng: -118.2437 } },
  { name: "Verbier", country: "Switzerland", coord: { lat: 46.0965, lng: 7.2262 } },
  { name: "Serengeti National Park", country: "Tanzania", coord: { lat: -2.3333, lng: 34.8333 } }
];

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDateWithinYears(years = 2) {
  const now = Date.now();
  const past = now - years * 365 * 24 * 60 * 60 * 1000;
  return new Date(randomInt(past, now)).toISOString();
}

const amenitiesPool = [
  "Wifi",
  "Kitchen",
  "Free parking",
  "Pool",
  "Hot tub",
  "Air conditioning",
  "Washer",
  "Dryer",
  "Pet friendly"
];

const sampleListings = [];
for (let i = 1; i <= 50; i++) {
  const loc = getRandom(locations);
  const title = `${getRandom(titles)} - ${loc.name}`;
  const images = [];
  const imagesCount = randomInt(1, 4);
  for (let k = 0; k < imagesCount; k++) images.push(getRandom(imagePool));

  const amenities = [];
  const amenCount = randomInt(3, 6);
  const shuffledAmenities = amenitiesPool.sort(() => 0.5 - Math.random());
  for (let a = 0; a < amenCount; a++) amenities.push(shuffledAmenities[a]);

  const rating = +(Math.random() * 2 + 3).toFixed(1); // 3.0 - 5.0

  sampleListings.push({
    id: i,
    title,
    slug: `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${i}`,
    description: getRandom(descriptions),
    images,
    image: {
      url: images[0],
      filename: `seed-listing-${i}.jpg`
    },
    price: randomInt(500, 9500),
    location: loc.name,
    country: loc.country,
    coordinates: loc.coord,
    amenities,
    host: {
      name: `Host ${randomInt(1, 50)}`,
      since: randomDateWithinYears(5)
    },
    createdAt: randomDateWithinYears(2),
    reviewsCount: randomInt(0, 800),
    rating
  });
}

module.exports = { data: sampleListings };


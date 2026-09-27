import { Attraction, Hotel, ItineraryResult } from '../types';

export const ATTRACTIONS_DATA: Attraction[] = [
  {
    id: 1,
    name: 'Amphitheatre of El Jem',
    category: 'history',
    location: 'El Jem',
    region: 'El Jem & Mahdia area',
    description: 'One of the most impressive and best-preserved Roman colosseums in the world, once hosting 35,000 spectators for gladiatorial spectacles. Visitors can explore subterranean beast chambers, climb tiered stone seating, and admire majestic freestanding arches rising over the central plains.',
    opening_hours: '08:00 - 18:30',
    price_dt: 12,
    duration_hours: 2.5,
    lat: 35.2965,
    lng: 10.7069,
    image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Amphi%20El%20Jem.jpg'
  },
  {
    id: 2,
    name: 'Carthage Archaeological Site & Antonine Baths',
    category: 'history',
    location: 'Carthage / Tunis',
    region: 'Tunis & Carthage area',
    description: 'The storied cradle of the Punic empire and rival to ancient Rome, perched dramatically over the Gulf of Tunis. Walk among the monumental Antonine thermal baths, inspect Punic naval ports, and visit Byrsa Hill for commanding coastal panoramas.',
    opening_hours: '08:30 - 17:30',
    price_dt: 15,
    duration_hours: 3.5,
    lat: 36.8529,
    lng: 10.3235,
    image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Antonine%20Baths.jpg'
  },
  {
    id: 3,
    name: 'Sidi Bou Said Blue & White Village',
    category: 'culture',
    location: 'Sidi Bou Said',
    region: 'Tunis & Carthage area',
    description: 'A cliffside Mediterranean village renowned for cobblestone alleys, whitewashed buildings, and vibrant sapphire-blue doors draped in flowering bougainvillea. Sip fresh mint tea with toasted pine nuts at Café des Délices while overlooking the glittering Mediterranean.',
    opening_hours: 'Open 24/7 (Shops 09:00 - 21:00)',
    price_dt: 0,
    duration_hours: 2.5,
    lat: 36.8703,
    lng: 10.3414,
    image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Door%20Sidi%20Bou%20Said.jpg'
  },
  {
    id: 4,
    name: 'Bardo National Museum',
    category: 'culture',
    location: 'Tunis',
    region: 'Tunis & Carthage area',
    description: 'Housed within a grandiose 15th-century Hafsid palace, this premier museum contains the worlds finest and most expansive collection of Roman and early Christian mosaics. Marvel at masterpieces depicting Virgil composing the Aeneid, Neptune triumphing, and intricate North African maritime scenes.',
    opening_hours: '09:00 - 17:00',
    price_dt: 13,
    duration_hours: 3.0,
    lat: 36.8093,
    lng: 10.1345,
    image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Tunis%2C%20Museum%20Bardo.jpg'
  },
  {
    id: 5,
    name: 'Chott el Djerid Salt Lake Totality Center',
    category: 'eclipse_viewing',
    location: 'Tozeur / Kebili',
    region: 'Tozeur & Chott Djerid area',
    description: 'An immense shimmering salt flat spanning nearly 5,000 square kilometers, famous for optical mirages and surreal crystalline crusts. This vast unobstructed desert basin sits directly under the central centerline for the August 2027 Total Solar Eclipse, providing world-class celestial viewing.',
    opening_hours: 'Open 24/7 (Best at Sunrise/Sunset)',
    price_dt: 0,
    duration_hours: 2.0,
    lat: 33.7083,
    lng: 8.4312,
    image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Chott%20el%20jerid.jpg'
  },
  {
    id: 6,
    name: 'Medina of Tunis & Al-Zaytuna Mosque',
    category: 'culture',
    location: 'Tunis',
    region: 'Tunis & Carthage area',
    description: 'A UNESCO World Heritage labyrinth boasting over 700 historic monuments, covered souks, ornate madrasas, and perfumeries centered around the 8th-century Al-Zaytuna Mosque. Wander past traditional leather craftsmen, chechia hat makers, and historic palace doorways.',
    opening_hours: '08:30 - 18:00',
    price_dt: 5,
    duration_hours: 3.0,
    lat: 36.7984,
    lng: 10.1706,
    image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Door%20in%20the%20medina%20of%20Tunis%2003.jpg'
  },
  {
    id: 7,
    name: 'Matmata Troglodyte Underground Dwellings',
    category: 'culture',
    location: 'Matmata',
    region: 'Matmata & Tataouine area',
    description: 'Iconic subterranean Berber architecture carved deep into sandstone pits to naturally insulate against desert extremes. Visitors can descend into living subterranean courtyards, meet local families, and tour the troglodyte complex used as Luke Skywalkers home in Star Wars.',
    opening_hours: '08:00 - 18:00',
    price_dt: 10,
    duration_hours: 2.0,
    lat: 33.5428,
    lng: 9.9672,
    image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Matmata%20Panorama.jpg'
  },
  {
    id: 8,
    name: 'Ksar Ouled Soltane & Berber Granaries',
    category: 'history',
    location: 'Tataouine',
    region: 'Matmata & Tataouine area',
    description: 'A spectacular multi-tiered fortified Berber granary (ksar) featuring vaulted clay storage chambers (ghorfas) stacked up to four stories high. Explore atmospheric curved stone courtyards that historically protected desert harvests and caravan trade routes.',
    opening_hours: '08:00 - 18:30',
    price_dt: 8,
    duration_hours: 2.0,
    lat: 32.7881,
    lng: 10.5147,
    image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ksar%20Ouled%20Soltane%20Vue%203.jpg'
  },
  {
    id: 9,
    name: 'Douz Sahara Grand Erg Dunes & Camel Treks',
    category: 'desert',
    location: 'Douz',
    region: 'Kebili & Douz Sahara area',
    description: 'Known as the Gateway to the Sahara, where towering ochre dunes of the Grand Erg Oriental meet palm-filled oasis fringes. Embark on sunset camel caravans, quad biking across rolling ridges, and sleep beneath pristine starlit desert skies.',
    opening_hours: '06:00 - 20:00',
    price_dt: 35,
    duration_hours: 3.5,
    lat: 33.4663,
    lng: 9.0203,
    image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Douz%201992%2001.jpg'
  },
  {
    id: 10,
    name: 'Tozeur Palmeraie & Chebika Mountain Oasis',
    category: 'desert',
    location: 'Tozeur',
    region: 'Tozeur & Chott Djerid area',
    description: 'An enchanting lush oasis network of several hundred thousand date palms fed by mountain springs, contrasting against rugged desert canyons. Hike through Chebika waterfalls, canyon gorges, and watch traditional palm climbers harvest world-famed Deglet Nour dates.',
    opening_hours: '08:00 - 19:00',
    price_dt: 15,
    duration_hours: 3.0,
    lat: 33.9197,
    lng: 8.1335,
    image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Chebika%20%282%29.JPG'
  },
  {
    id: 11,
    name: 'Kebili Desert Ridge Solar Observatory Site',
    category: 'eclipse_viewing',
    location: 'Kebili',
    region: 'Kebili & Douz Sahara area',
    description: 'Positioned right along the prime Totality axis of the August 2, 2027 Total Solar Eclipse with predicted maximum duration of totality exceeding 5 minutes and 40 seconds. Features panoramic desert bluffs and low atmospheric humidity perfect for astrophotography.',
    opening_hours: 'Open 24/7',
    price_dt: 0,
    duration_hours: 2.0,
    lat: 33.7044,
    lng: 8.9690,
    image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/I%20love%20kebili%20sign.jpg'
  },
  {
    id: 12,
    name: 'Djerba Island Houmt Souk & Djerbahood',
    category: 'culture',
    location: 'Djerba',
    region: 'Djerba & Kerkennah Islands area',
    description: 'A serene Mediterranean island combining traditional whitewashed architecture with vibrant open-air street art in the historic village of Erriadh. Stroll through the Jewish Quarter and ancient El Ghriba Synagogue, browse silver jewelry in Houmt Souk, and sample fresh seafood.',
    opening_hours: '09:00 - 19:00',
    price_dt: 10,
    duration_hours: 3.0,
    lat: 33.8750,
    lng: 10.8572,
    image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Houmt%20Souk%20May%202007.JPG'
  },
  {
    id: 13,
    name: 'Tabarka Needles & Coral Coast Reefs',
    category: 'beach',
    location: 'Tabarka',
    region: 'North-West & Tabarka area',
    description: 'A verdant coastal paradise framed by lush cork oak forests and colossal jagged ochre monoliths sculpted by the sea called Les Aiguilles. Perfect for world-class scuba diving among red coral grottos, sailing, and relaxing along pristine northern shores.',
    opening_hours: 'Open 24/7',
    price_dt: 0,
    duration_hours: 2.5,
    lat: 36.9544,
    lng: 8.7580,
    image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Tabarka%20aiguille1.JPG'
  },
  {
    id: 14,
    name: 'Old Port of Bizerte & Spanish Fort',
    category: 'beach',
    location: 'Bizerte',
    region: 'Bizerte & Ichkeul area',
    description: 'The northernmost city in Africa, boasting an evocative horseshoe canal harbor filled with colorful wooden fishing boats. Tour the 16th-century Ottoman Kasbah walls, explore the Oceanographic Museum, and dine on fresh grilled dorade alongside the quayside.',
    opening_hours: '08:30 - 18:00',
    price_dt: 6,
    duration_hours: 2.5,
    lat: 37.2746,
    lng: 9.8739,
    image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Le%20vieux%20port%20de%20BIZERTE-Tunisie.jpg'
  },
  {
    id: 15,
    name: 'Ichkeul National Park & Bird Sanctuary',
    category: 'history',
    location: 'Ichkeul / Bizerte',
    region: 'Bizerte & Ichkeul area',
    description: 'A UNESCO Biosphere wetland sanctuary centered around Lake Ichkeul and an isolated limestone mountain massif. During migratory seasons, hundreds of thousands of pink flamingos, storks, and rare waterbirds gather here along scenic marsh boardwalks and hiking trails.',
    opening_hours: '08:00 - 17:30',
    price_dt: 5,
    duration_hours: 3.0,
    lat: 37.1650,
    lng: 9.6644,
    image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bluethroat%20%28Luscinia%20svecica%29%20at%20Ichkeul%20NP.jpg'
  },
  {
    id: 16,
    name: 'Nabeul Artisan Pottery Market & Cap Bon Coast',
    category: 'beach',
    location: 'Nabeul',
    region: 'Cap Bon & Nabeul area',
    description: 'The ceramic and citrus capital of Tunisia, where multi-generational artisans throw glazed earthenware and carve fragrant orange blossom essences. Stroll through the Friday souk, inspect ancient Roman garum salting vats at Neapolis, and enjoy calm Mediterranean beaches.',
    opening_hours: '09:00 - 19:00',
    price_dt: 0,
    duration_hours: 2.5,
    lat: 36.4561,
    lng: 10.7376,
    image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Masque%20en%20poterie%20Neapolis.JPG'
  },
  {
    id: 17,
    name: 'Zaghouan Water Temple & Roman Aqueduct',
    category: 'history',
    location: 'Zaghouan',
    region: 'Zaghouan & Central North area',
    description: 'Nestled at the base of dramatic Mount Zaghouan, this ornate semicircular Nymphaeum once collected mountain springs to supply Carthage through a 132-kilometer aqueduct. Walk alongside towering stone arches, explore mountain olive groves, and taste traditional kaak warka pastries.',
    opening_hours: '08:30 - 17:30',
    price_dt: 8,
    duration_hours: 2.0,
    lat: 36.3986,
    lng: 10.1428,
    image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Zaghouan%20Temple%20d%27eau.jpg'
  },
  {
    id: 18,
    name: 'Ribat of Monastir Coastal Fortress',
    category: 'history',
    location: 'Monastir',
    region: 'Sahel & Monastir area',
    description: 'An 8th-century Islamic coastal fortress founded to protect the Maghreb coastline against Byzantine naval raids. Climb the watchtower for panoramic vistas across the Mediterranean marina, explore historical prayer halls, and admire the neighboring Bourguiba Mausoleum.',
    opening_hours: '08:00 - 18:00',
    price_dt: 10,
    duration_hours: 2.0,
    lat: 35.7761,
    lng: 10.8329,
    image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ribat%20de%20Monastir%20111.jpg'
  },
  {
    id: 19,
    name: 'Gafsa Roman Basins & Capsian Oasis Springs',
    category: 'history',
    location: 'Gafsa',
    region: 'Central West & Gafsa area',
    description: 'Monumental open-air stone bathing pools constructed in the Roman era, continuously replenished by natural warm sulfurous spring waters. Located in the heart of Gafsa, it offers a glimpse into prehistoric Capsian culture and oasis life.',
    opening_hours: '08:00 - 18:00',
    price_dt: 4,
    duration_hours: 1.5,
    lat: 34.4250,
    lng: 8.7842,
    image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Piscines%20romaines%20de%20Gafsa%2C%20juin%202013.jpg'
  },
  {
    id: 20,
    name: 'Dougga Roman Archaeological City',
    category: 'history',
    location: 'Dougga / Beja',
    region: 'Dougga & Beja area',
    description: 'Widely celebrated as the best-preserved Roman small town in North Africa, sprawling across a picturesque hillside overlooking fertile wheat valleys. Marvel at the grand Capitol dedicated to Jupiter, Juno, and Minerva, the Libyco-Punic Mausoleum, and the 3,500-seat theater.',
    opening_hours: '08:30 - 17:30',
    price_dt: 12,
    duration_hours: 3.5,
    lat: 36.4225,
    lng: 9.2192,
    image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Temple%20aux%20six%20colonnes%2003.jpg'
  },
  {
    id: 21,
    name: 'Great Mosque of Kairouan (Uqba Mosque)',
    category: 'culture',
    location: 'Kairouan',
    region: 'Kairouan area',
    description: 'The fourth holiest site in Islam and one of the oldest places of worship in the Islamic world, founded in 670 AD. Inspect the majestic stone courtyard surrounded by Roman and Byzantine marble colonnades, the three-tiered square minaret, and finely woven Kairouan carpets in surrounding souks.',
    opening_hours: '08:00 - 14:00',
    price_dt: 10,
    duration_hours: 2.0,
    lat: 35.6814,
    lng: 10.1039,
    image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Great%20Mosque%20of%20Kairouan%20%28Okba%20Mosque%29%2C%20the%20main%20dome%203.jpg'
  },
  {
    id: 22,
    name: 'Sousse Medina & Ribat Fortress',
    category: 'culture',
    location: 'Sousse',
    region: 'Sahel & Monastir area',
    description: 'An energetic coastal fortified city with whitewashed homes, fortified watchtowers, and souks filled with olive wood carvings and spices. Climb the Ribat watchtower for panoramic views of the Gulf of Hammamet and explore the archaeological museum inside the Kasbah.',
    opening_hours: '08:30 - 18:00',
    price_dt: 9,
    duration_hours: 2.5,
    lat: 35.8288,
    lng: 10.6380,
    image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Medina%20of%20Sousse-130323.jpg'
  },
  {
    id: 23,
    name: 'Hammamet Medina & Gulf Beaches',
    category: 'beach',
    location: 'Hammamet',
    region: 'Cap Bon & Nabeul area',
    description: 'Tunisias flagship resort sanctuary with golden sandy beaches, calm turquoise waters, and a fortified 15th-century seafront medina. Stroll along the seaside battlements, explore the gardens of Villa Sebastian, and dine on fresh seafood by the waves.',
    opening_hours: 'Open 24/7',
    price_dt: 0,
    duration_hours: 3.0,
    lat: 36.4000,
    lng: 10.6167,
    image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Hammamet%20Medina%20R01.jpg'
  },
  {
    id: 24,
    name: 'Chenini Mountain Berber Citadel',
    category: 'history',
    location: 'Tataouine / Chenini',
    region: 'Matmata & Tataouine area',
    description: 'A dramatic ruined fortified village clinging like an eagle nest to a crest in the Dahahar mountains. Discover ancient cave dwellings, the whitewashed Mosque of the Seven Sleepers, and panoramic views over arid desert plains.',
    opening_hours: '08:00 - 18:00',
    price_dt: 5,
    duration_hours: 2.0,
    lat: 32.9119,
    lng: 10.2619,
    image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Porte%20de%20maison%20troglodytique%20-%20Village%20Chenini%20-%20Tataouine%20%285405435557%29.jpg'
  },
  {
    id: 25,
    name: 'Ong Jemel & Mos Espa Desert Star Wars Set',
    category: 'desert',
    location: 'Tozeur',
    region: 'Tozeur & Chott Djerid area',
    description: 'The famous Neck of the Camel rock formation rising out of windswept desert dunes, flanked by the preserved movie set of Mos Espa. Walk among domed moisture vaporators and futuristic desert huts nestled directly in the Sahara sand dunes.',
    opening_hours: '07:00 - 19:00',
    price_dt: 20,
    duration_hours: 3.0,
    lat: 33.9922,
    lng: 7.8447,
    image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ong%20Jmel%2C%20Mos%20Espa%2C%20Star%20Wars%20set%2C%20Nefta%2C%20Tunisie%20DSC%201994.jpg'
  },
  {
    id: 26,
    name: 'Kerkennah Archipelago Eclipse Coastal Lookout',
    category: 'eclipse_viewing',
    location: 'Kerkennah / Sfax',
    region: 'Djerba & Kerkennah Islands area',
    description: 'A serene flat archipelago of palm-studded fishing islands located off the eastern coast of Tunisia, right on the central 2027 totality line. Experience traditional charfiya labyrinth fishing techniques, quiet sandy lagoons, and uninterrupted horizon views for totality.',
    opening_hours: 'Open 24/7 (Ferry from Sfax)',
    price_dt: 5,
    duration_hours: 3.5,
    lat: 34.7180,
    lng: 11.1680,
    image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/P%C3%A9cheur%20sur%20son%20bateau%20%C3%A0%20Kerkennah.jpg'
  },
  {
    id: 27,
    name: 'Cap Serrat Wild Coast & Lighthouse',
    category: 'beach',
    location: 'Bizerte / Sejnane',
    region: 'Bizerte & Ichkeul area',
    description: 'An untouched coastal haven where wild pine forests roll down to meet golden sand coves and clear turquoise Mediterranean waters. Hike up to the scenic black-and-white striped lighthouse and camp or picnic along peaceful secluded beaches.',
    opening_hours: 'Open 24/7',
    price_dt: 0,
    duration_hours: 3.0,
    lat: 37.2344,
    lng: 9.2144,
    image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cap%20Serrat%20-%20May%202009.jpg'
  },
  {
    id: 28,
    name: 'Sbeitla Sufetula Roman Forum & Capitol Triad',
    category: 'history',
    location: 'Sbeitla / Kasserine',
    region: 'Central West & Gafsa area',
    description: 'A remarkably preserved Roman-Byzantine provincial city featuring three separate, side-by-side Capitol temples linked by classical porticos. Walk through the Antoninus Arch, admire Byzantine defensive towers, and inspect intricate Christian baptismal fonts paved in mosaics.',
    opening_hours: '08:00 - 17:30',
    price_dt: 10,
    duration_hours: 2.5,
    lat: 35.2392,
    lng: 9.1292,
    image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sbeitla%2010.jpg'
  }
];

export const HOTELS_DATA: Hotel[] = [
  {
    id: 1,
    name: 'Sahara Eclipse Lodge',
    location: 'Tozeur',
    region: 'Tozeur & Chott Djerid area',
    has_eclipse_view: true,
    price_per_night_dt: 250,
    description: 'Desert lodge directly on the August 2027 eclipse path of totality with private terrace telescope setups and direct dune access.',
    image_url: '', // Falls back to solid-color placeholder card
    rating: 4.9
  },
  {
    id: 2,
    name: 'Dunes Panorama Hotel',
    location: 'Kebili',
    region: 'Kebili & Douz Sahara area',
    has_eclipse_view: true,
    price_per_night_dt: 180,
    description: 'Rooftop terrace with clear southern sky view for eclipse viewing, surrounded by peaceful date palm groves.',
    image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Entr%C3%A9e%20Oasis-Kebili.JPG',
    rating: 4.7
  },
  {
    id: 3,
    name: 'Douz Oasis Hotel',
    location: 'Douz',
    region: 'Kebili & Douz Sahara area',
    has_eclipse_view: false,
    price_per_night_dt: 90,
    description: 'Standard oasis-town hotel, short drive to viewing sites and camel excursion stations at the edge of the dunes.',
    image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Douz%20palm%20oasis.jpg',
    rating: 4.2
  },
  {
    id: 4,
    name: 'Dar El Jeld Heritage Hotel & Spa',
    location: 'Tunis',
    region: 'Tunis & Carthage area',
    has_eclipse_view: false,
    price_per_night_dt: 320,
    description: 'Sumptuous boutique palace inside the Tunis Medina featuring hand-carved stucco, tranquil jasmine courtyards, and traditional hammam treatments.',
    image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Dar%20El%20Jeld%20-%20Medina%20Tunis.jpg',
    rating: 4.9
  },
  {
    id: 5,
    name: 'Les Aiguilles Resort & Diving Hotel',
    location: 'Tabarka',
    region: 'North-West & Tabarka area',
    has_eclipse_view: false,
    price_per_night_dt: 160,
    description: 'Scenic hillside coastal hotel overlooking Tabarkas dramatic rock needles with an in-house diving center and seaside terrace.',
    image_url: '', // Falls back to solid-color placeholder card
    rating: 4.6
  },
  {
    id: 6,
    name: 'Bizerte Nautical Harbor Hotel',
    location: 'Bizerte',
    region: 'Bizerte & Ichkeul area',
    has_eclipse_view: false,
    price_per_night_dt: 140,
    description: 'Waterfront property along the old canal marina with panoramic views of traditional wooden trawlers and the Spanish Fort.',
    image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bac%2C%20canal%20et%20lac%20de%20Bizerte%20en%201890.jpg',
    rating: 4.4
  },
  {
    id: 7,
    name: 'Ksar Jouamaa Mountain Lodge',
    location: 'Tataouine',
    region: 'Matmata & Tataouine area',
    has_eclipse_view: true,
    price_per_night_dt: 130,
    description: 'Perched 600 meters high in a restored 12th-century hilltop Berber fortress with 360-degree desert vistas and stellar solar eclipse horizon sightlines.',
    image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ksar%20Jouamaa.jpg',
    rating: 4.8
  },
  {
    id: 8,
    name: 'Marhala Troglodyte Underground Hotel',
    location: 'Matmata',
    region: 'Matmata & Tataouine area',
    has_eclipse_view: false,
    price_per_night_dt: 85,
    description: 'Authentic subterranean hotel dug directly into sandstone crater pits, offering naturally cool temperatures, Berber carpets, and candlelit rooms.',
    image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Tunisia-3533%20-%20Main%20courtyard%20of%20the%20Hotel.%20%287847465888%29.jpg',
    rating: 4.3
  },
  {
    id: 9,
    name: 'Hasdrubal Prestige Thalassa & Spa',
    location: 'Djerba',
    region: 'Djerba & Kerkennah Islands area',
    has_eclipse_view: false,
    price_per_night_dt: 280,
    description: 'Luxury beachfront sanctuary set directly on white sands with lagoon swimming pools and world-class seawater therapies.',
    image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/ClubMed-Strand%20auf%20Djerba%20bei%20Nacht.jpg',
    rating: 4.9
  },
  {
    id: 10,
    name: 'Palais Khereddine Heritage Hotel',
    location: 'Monastir',
    region: 'Sahel & Monastir area',
    has_eclipse_view: false,
    price_per_night_dt: 175,
    description: 'Elegant Mediterranean coastal hotel facing the historic Ribat and marina, featuring Moorish archways and fine olive-oil dining.',
    image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Marina%204%20Monastir.jpg',
    rating: 4.6
  },
  {
    id: 11,
    name: 'Oasis Gafsa Palm Hotel & Totality Base',
    location: 'Gafsa',
    region: 'Central West & Gafsa area',
    has_eclipse_view: true,
    price_per_night_dt: 110,
    description: 'Surrounded by ancient palm groves and mineral springs, conveniently located along the totality path with wide clear skies.',
    image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Le%20b%C3%A2timent%20de%20la%20Compagnie%20des%20Phosphates%20et%20du%20Chemin%20de%20fer%20Sfax-Gafsa%20-%20A65570S.jpg',
    rating: 4.3
  },
  {
    id: 12,
    name: 'Dar Zaghouan Eco Farm & Spa',
    location: 'Zaghouan',
    region: 'Zaghouan & Central North area',
    has_eclipse_view: false,
    price_per_night_dt: 150,
    description: 'Picturesque agrotourism retreat nestled under Mount Zaghouan with mountain water springs, olive oil tasting, and traditional stone suites.',
    image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/20231211%20096%20Dar%20Zaghouan.jpg',
    rating: 4.7
  }
];

// Helper to determine primary region from user staying location input
export function getRegionForLocation(loc: string): string {
  const l = loc.toLowerCase().trim();
  if (l.includes('tunis') || l.includes('carthage') || l.includes('sidi bou said') || l.includes('marsa') || l.includes('gammarth')) {
    return 'Tunis & Carthage area';
  }
  if (l.includes('tozeur') || l.includes('nefta') || l.includes('ong')) {
    return 'Tozeur & Chott Djerid area';
  }
  if (l.includes('douz') || l.includes('kebili')) {
    return 'Kebili & Douz Sahara area';
  }
  if (l.includes('sousse') || l.includes('monastir') || l.includes('mahdia')) {
    return 'Sahel & Monastir area';
  }
  if (l.includes('el jem') || l.includes('djem')) {
    return 'El Jem & Mahdia area';
  }
  if (l.includes('kairouan')) {
    return 'Kairouan area';
  }
  if (l.includes('djerba') || l.includes('kerkennah') || l.includes('sfax')) {
    return 'Djerba & Kerkennah Islands area';
  }
  if (l.includes('tataouine') || l.includes('matmata') || l.includes('chenini')) {
    return 'Matmata & Tataouine area';
  }
  if (l.includes('tabarka') || l.includes('ain draham') || l.includes('jendouba')) {
    return 'North-West & Tabarka area';
  }
  if (l.includes('bizerte') || l.includes('ichkeul') || l.includes('serrat')) {
    return 'Bizerte & Ichkeul area';
  }
  if (l.includes('nabeul') || l.includes('hammamet') || l.includes('kelibia') || l.includes('cap bon')) {
    return 'Cap Bon & Nabeul area';
  }
  if (l.includes('zaghouan')) {
    return 'Zaghouan & Central North area';
  }
  if (l.includes('dougga') || l.includes('beja') || l.includes('teboursouk')) {
    return 'Dougga & Beja area';
  }
  if (l.includes('gafsa') || l.includes('sbeitla') || l.includes('kasserine')) {
    return 'Central West & Gafsa area';
  }
  return 'Tunis & Carthage area';
}

// Nearby adjacent regions map
export const ADJACENT_REGIONS: Record<string, string[]> = {
  'Tunis & Carthage area': ['Cap Bon & Nabeul area', 'Bizerte & Ichkeul area', 'Zaghouan & Central North area'],
  'Cap Bon & Nabeul area': ['Tunis & Carthage area', 'Sahel & Monastir area', 'Zaghouan & Central North area'],
  'Bizerte & Ichkeul area': ['Tunis & Carthage area', 'North-West & Tabarka area', 'Dougga & Beja area'],
  'North-West & Tabarka area': ['Bizerte & Ichkeul area', 'Dougga & Beja area'],
  'Dougga & Beja area': ['North-West & Tabarka area', 'Tunis & Carthage area', 'Zaghouan & Central North area', 'Kairouan area'],
  'Zaghouan & Central North area': ['Tunis & Carthage area', 'Cap Bon & Nabeul area', 'Kairouan area', 'Dougga & Beja area'],
  'Sahel & Monastir area': ['El Jem & Mahdia area', 'Kairouan area', 'Cap Bon & Nabeul area'],
  'Kairouan area': ['Sahel & Monastir area', 'El Jem & Mahdia area', 'Zaghouan & Central North area', 'Central West & Gafsa area'],
  'El Jem & Mahdia area': ['Sahel & Monastir area', 'Kairouan area', 'Djerba & Kerkennah Islands area'],
  'Central West & Gafsa area': ['Tozeur & Chott Djerid area', 'Kairouan area', 'Kebili & Douz Sahara area'],
  'Tozeur & Chott Djerid area': ['Kebili & Douz Sahara area', 'Central West & Gafsa area'],
  'Kebili & Douz Sahara area': ['Tozeur & Chott Djerid area', 'Matmata & Tataouine area', 'Central West & Gafsa area'],
  'Matmata & Tataouine area': ['Kebili & Douz Sahara area', 'Djerba & Kerkennah Islands area'],
  'Djerba & Kerkennah Islands area': ['Matmata & Tataouine area', 'El Jem & Mahdia area']
};

export const DEFAULT_FALLBACK_ITINERARY: ItineraryResult = {
  days: [
    {
      day: 1,
      stops: [
        {
          attraction_id: 2, // Carthage
          reason: 'Explore the monumental Roman Antonine thermal baths and Punic ports located within the Tunis metropolitan coast.',
          selected: true
        },
        {
          attraction_id: 3, // Sidi Bou Said
          reason: 'A short 5-minute stroll up to the cliffside blue-and-white village for mint tea and panoramic Mediterranean views.',
          selected: true
        },
        {
          attraction_id: 6, // Medina of Tunis
          reason: 'Conclude the afternoon exploring historic artisan souks and Zitouna Mosque in the central historic medina.',
          selected: true
        }
      ]
    },
    {
      day: 2,
      stops: [
        {
          attraction_id: 4, // Bardo National Museum
          reason: 'Spend the morning admiring the world-renowned Roman mosaic galleries in the former royal palace in Tunis.',
          selected: true
        },
        {
          attraction_id: 17, // Zaghouan Water Temple
          reason: 'Regional day transfer (~45 mins south): Visit the monumental Roman water temple that historically supplied Carthage via aqueduct.',
          selected: true
        }
      ]
    }
  ],
  suggested_hotel_id: 4 // Dar El Jeld Heritage Hotel (Tunis)
};

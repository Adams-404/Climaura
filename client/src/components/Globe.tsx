import { useEffect, useRef, useState } from "react";
import Globe from "react-globe.gl";
import { type ContinentKey } from "@shared/schema";

// Continent colors for consistent theming
const CONTINENT_COLORS: Record<string, string> = {
  africa: "#10b981",
  asia: "#3b82f6",
  europe: "#8b5cf6",
  northAmerica: "#f59e0b",
  southAmerica: "#ef4444",
  oceania: "#06b6d4",
  antarctica: "#ffffff"
};

// Comprehensive list of countries with their capitals and coordinates
const COUNTRIES = [
  { name: "Afghanistan", lat: 34.5167, lng: 69.1833, capital: "Kabul", continent: "asia" },
  { name: "Albania", lat: 41.3275, lng: 19.8189, capital: "Tirana", continent: "europe" },
  { name: "Algeria", lat: 36.7539, lng: 3.0589, capital: "Algiers", continent: "africa" },
  { name: "Andorra", lat: 42.5063, lng: 1.5218, capital: "Andorra la Vella", continent: "europe" },
  { name: "Angola", lat: -8.8383, lng: 13.2344, capital: "Luanda", continent: "africa" },
  { name: "Antigua and Barbuda", lat: 17.1175, lng: -61.8456, capital: "Saint John's", continent: "northAmerica" },
  { name: "Argentina", lat: -34.6118, lng: -58.4173, capital: "Buenos Aires", continent: "southAmerica" },
  { name: "Armenia", lat: 40.1811, lng: 44.5136, capital: "Yerevan", continent: "asia" },
  { name: "Australia", lat: -35.282, lng: 149.1286, capital: "Canberra", continent: "oceania" },
  { name: "Austria", lat: 48.2082, lng: 16.3738, capital: "Vienna", continent: "europe" },
  { name: "Azerbaijan", lat: 40.4093, lng: 49.8671, capital: "Baku", continent: "asia" },
  { name: "Bahamas", lat: 25.0667, lng: -77.3333, capital: "Nassau", continent: "northAmerica" },
  { name: "Bahrain", lat: 26.2167, lng: 50.5833, capital: "Manama", continent: "asia" },
  { name: "Bangladesh", lat: 23.7289, lng: 90.3944, capital: "Dhaka", continent: "asia" },
  { name: "Barbados", lat: 13.0975, lng: -59.6167, capital: "Bridgetown", continent: "northAmerica" },
  { name: "Belarus", lat: 53.9, lng: 27.5667, capital: "Minsk", continent: "europe" },
  { name: "Belgium", lat: 50.8467, lng: 4.3525, capital: "Brussels", continent: "europe" },
  { name: "Belize", lat: 17.25, lng: -88.7667, capital: "Belmopan", continent: "northAmerica" },
  { name: "Benin", lat: 6.4833, lng: 2.6167, capital: "Porto-Novo", continent: "africa" },
  { name: "Bhutan", lat: 27.4722, lng: 89.6361, capital: "Thimphu", continent: "asia" },
  { name: "Bolivia", lat: -16.4942, lng: -68.1475, capital: "Sucre", continent: "southAmerica" },
  { name: "Bosnia and Herzegovina", lat: 43.8563, lng: 18.4131, capital: "Sarajevo", continent: "europe" },
  { name: "Botswana", lat: -24.6569, lng: 25.9086, capital: "Gaborone", continent: "africa" },
  { name: "Brazil", lat: -15.7939, lng: -47.8828, capital: "Brasília", continent: "southAmerica" },
  { name: "Brunei", lat: 4.8925, lng: 114.9422, capital: "Bandar Seri Begawan", continent: "asia" },
  { name: "Bulgaria", lat: 42.7, lng: 23.33, capital: "Sofia", continent: "europe" },
  { name: "Burkina Faso", lat: 12.3686, lng: -1.5275, capital: "Ouagadougou", continent: "africa" },
  { name: "Burundi", lat: -3.3833, lng: 29.3667, capital: "Gitega", continent: "africa" },
  { name: "Cabo Verde", lat: 14.9177, lng: -23.5092, capital: "Praia", continent: "africa" },
  { name: "Cambodia", lat: 11.5696, lng: 104.921, capital: "Phnom Penh", continent: "asia" },
  { name: "Cameroon", lat: 3.8667, lng: 11.5167, capital: "Yaoundé", continent: "africa" },
  { name: "Canada", lat: 45.4215, lng: -75.6972, capital: "Ottawa", continent: "northAmerica" },
  { name: "Central African Republic", lat: 4.3667, lng: 18.5833, capital: "Bangui", continent: "africa" },
  { name: "Chad", lat: 12.1097, lng: 15.05, capital: "N'Djamena", continent: "africa" },
  { name: "Chile", lat: -33.45, lng: -70.6667, capital: "Santiago", continent: "southAmerica" },
  { name: "China", lat: 39.9042, lng: 116.4074, capital: "Beijing", continent: "asia" },
  { name: "Colombia", lat: 4.7111, lng: -74.0722, capital: "Bogotá", continent: "southAmerica" },
  { name: "Comoros", lat: -11.7036, lng: 43.2536, capital: "Moroni", continent: "africa" },
  { name: "Congo", lat: -4.3, lng: 15.2833, capital: "Brazzaville", continent: "africa" },
  { name: "Costa Rica", lat: 9.9333, lng: -84.0833, capital: "San José", continent: "northAmerica" },
  { name: "Croatia", lat: 45.8, lng: 16, capital: "Zagreb", continent: "europe" },
  { name: "Cuba", lat: 23.1367, lng: -82.3589, capital: "Havana", continent: "northAmerica" },
  { name: "Cyprus", lat: 35.1667, lng: 33.3667, capital: "Nicosia", continent: "europe" },
  { name: "Czech Republic", lat: 50.0833, lng: 14.4167, capital: "Prague", continent: "europe" },
  { name: "Denmark", lat: 55.6761, lng: 12.5683, capital: "Copenhagen", continent: "europe" },
  { name: "Djibouti", lat: 11.595, lng: 43.1481, capital: "Djibouti City", continent: "africa" },
  { name: "Dominica", lat: 15.3, lng: -61.4, capital: "Roseau", continent: "northAmerica" },
  { name: "Dominican Republic", lat: 18.4833, lng: -69.9333, capital: "Santo Domingo", continent: "northAmerica" },
  { name: "East Timor", lat: -8.5586, lng: 125.5742, capital: "Dili", continent: "asia" },
  { name: "Ecuador", lat: -0.22, lng: -78.5125, capital: "Quito", continent: "southAmerica" },
  { name: "Egypt", lat: 30.0444, lng: 31.2358, capital: "Cairo", continent: "africa" },
  { name: "El Salvador", lat: 13.6989, lng: -89.1914, capital: "San Salvador", continent: "northAmerica" },
  { name: "Equatorial Guinea", lat: 3.75, lng: 8.7833, capital: "Malabo", continent: "africa" },
  { name: "Eritrea", lat: 15.3333, lng: 38.9167, capital: "Asmara", continent: "africa" },
  { name: "Estonia", lat: 59.4372, lng: 24.745, capital: "Tallinn", continent: "europe" },
  { name: "Eswatini", lat: -26.3167, lng: 31.1333, capital: "Mbabane", continent: "africa" },
  { name: "Ethiopia", lat: 9.03, lng: 38.74, capital: "Addis Ababa", continent: "africa" },
  { name: "Fiji", lat: -18.1416, lng: 178.4419, capital: "Suva", continent: "oceania" },
  { name: "Finland", lat: 60.1708, lng: 24.9375, capital: "Helsinki", continent: "europe" },
  { name: "France", lat: 48.8566, lng: 2.3522, capital: "Paris", continent: "europe" },
  { name: "Gabon", lat: 0.39, lng: 9.4544, capital: "Libreville", continent: "africa" },
  { name: "Gambia", lat: 13.4531, lng: -16.5775, capital: "Banjul", continent: "africa" },
  { name: "Georgia", lat: 41.7225, lng: 44.7928, capital: "Tbilisi", continent: "asia" },
  { name: "Germany", lat: 52.52, lng: 13.405, capital: "Berlin", continent: "europe" },
  { name: "Ghana", lat: 5.55, lng: -0.2, capital: "Accra", continent: "africa" },
  { name: "Greece", lat: 37.9842, lng: 23.7281, capital: "Athens", continent: "europe" },
  { name: "Grenada", lat: 12.05, lng: -61.75, capital: "St. George's", continent: "northAmerica" },
  { name: "Guatemala", lat: 14.6099, lng: -90.5252, capital: "Guatemala City", continent: "northAmerica" },
  { name: "Guinea", lat: 9.5092, lng: -13.7122, capital: "Conakry", continent: "africa" },
  { name: "Guinea-Bissau", lat: 11.8592, lng: -15.5956, capital: "Bissau", continent: "africa" },
  { name: "Guyana", lat: 6.8058, lng: -58.1508, capital: "Georgetown", continent: "southAmerica" },
  { name: "Haiti", lat: 18.5425, lng: -72.3386, capital: "Port-au-Prince", continent: "northAmerica" },
  { name: "Honduras", lat: 14.1, lng: -87.2167, capital: "Tegucigalpa", continent: "northAmerica" },
  { name: "Hungary", lat: 47.4925, lng: 19.0514, capital: "Budapest", continent: "europe" },
  { name: "Iceland", lat: 64.1475, lng: -21.935, capital: "Reykjavík", continent: "europe" },
  { name: "India", lat: 28.6139, lng: 77.209, capital: "New Delhi", continent: "asia" },
  { name: "Indonesia", lat: -6.2146, lng: 106.8451, capital: "Jakarta", continent: "asia" },
  { name: "Iran", lat: 35.6892, lng: 51.389, capital: "Tehran", continent: "asia" },
  { name: "Iraq", lat: 33.35, lng: 44.4167, capital: "Baghdad", continent: "asia" },
  { name: "Ireland", lat: 53.3497, lng: -6.2603, capital: "Dublin", continent: "europe" },
  { name: "Israel", lat: 31.7833, lng: 35.2167, capital: "Jerusalem", continent: "asia" },
  { name: "Italy", lat: 41.9, lng: 12.5, capital: "Rome", continent: "europe" },
  { name: "Jamaica", lat: 17.9714, lng: -76.7931, capital: "Kingston", continent: "northAmerica" },
  { name: "Japan", lat: 35.6839, lng: 139.7744, capital: "Tokyo", continent: "asia" },
  { name: "Jordan", lat: 31.95, lng: 35.9333, capital: "Amman", continent: "asia" },
  { name: "Kazakhstan", lat: 51.1667, lng: 71.4167, capital: "Nur-Sultan", continent: "asia" },
  { name: "Kenya", lat: -1.2864, lng: 36.8172, capital: "Nairobi", continent: "africa" },
  { name: "Kiribati", lat: 1.328, lng: 172.975, capital: "South Tarawa", continent: "oceania" },
  { name: "Kuwait", lat: 29.3759, lng: 47.9774, capital: "Kuwait City", continent: "asia" },
  { name: "Kyrgyzstan", lat: 42.8667, lng: 74.5667, capital: "Bishkek", continent: "asia" },
  { name: "Laos", lat: 17.9667, lng: 102.6, capital: "Vientiane", continent: "asia" },
  { name: "Latvia", lat: 56.9489, lng: 24.1064, capital: "Riga", continent: "europe" },
  { name: "Lebanon", lat: 33.8869, lng: 35.5131, capital: "Beirut", continent: "asia" },
  { name: "Lesotho", lat: -29.31, lng: 27.48, capital: "Maseru", continent: "africa" },
  { name: "Liberia", lat: 6.3106, lng: -10.8047, capital: "Monrovia", continent: "africa" },
  { name: "Libya", lat: 32.8872, lng: 13.1913, capital: "Tripoli", continent: "africa" },
  { name: "Liechtenstein", lat: 47.1415, lng: 9.5215, capital: "Vaduz", continent: "europe" },
  { name: "Lithuania", lat: 54.6833, lng: 25.2833, capital: "Vilnius", continent: "europe" },
  { name: "Luxembourg", lat: 49.6106, lng: 6.1328, capital: "Luxembourg City", continent: "europe" },
  { name: "Madagascar", lat: -18.9386, lng: 47.5214, capital: "Antananarivo", continent: "africa" },
  { name: "Malawi", lat: -13.9833, lng: 33.7833, capital: "Lilongwe", continent: "africa" },
  { name: "Malaysia", lat: 3.1478, lng: 101.6953, capital: "Kuala Lumpur", continent: "asia" },
  { name: "Maldives", lat: 4.175, lng: 73.5083, capital: "Malé", continent: "asia" },
  { name: "Mali", lat: 12.6458, lng: -7.9922, capital: "Bamako", continent: "africa" },
  { name: "Malta", lat: 35.8978, lng: 14.5125, capital: "Valletta", continent: "europe" },
  { name: "Marshall Islands", lat: 7.0667, lng: 171.2667, capital: "Majuro", continent: "oceania" },
  { name: "Mauritania", lat: 18.0858, lng: -15.9785, capital: "Nouakchott", continent: "africa" },
  { name: "Mauritius", lat: -20.2, lng: 57.5, capital: "Port Louis", continent: "africa" },
  { name: "Mexico", lat: 19.4333, lng: -99.1333, capital: "Mexico City", continent: "northAmerica" },
  { name: "Micronesia", lat: 6.9167, lng: 158.15, capital: "Palikir", continent: "oceania" },
  { name: "Moldova", lat: 47.0228, lng: 28.8353, capital: "Chișinău", continent: "europe" },
  { name: "Monaco", lat: 43.7333, lng: 7.4167, capital: "Monaco", continent: "europe" },
  { name: "Mongolia", lat: 47.9203, lng: 106.9172, capital: "Ulaanbaatar", continent: "asia" },
  { name: "Montenegro", lat: 42.4397, lng: 19.2661, capital: "Podgorica", continent: "europe" },
  { name: "Morocco", lat: 34.0253, lng: -6.8361, capital: "Rabat", continent: "africa" },
  { name: "Mozambique", lat: -25.95, lng: 32.5833, capital: "Maputo", continent: "africa" },
  { name: "Myanmar", lat: 16.8, lng: 96.15, capital: "Naypyidaw", continent: "asia" },
  { name: "Namibia", lat: -22.57, lng: 17.0836, capital: "Windhoek", continent: "africa" },
  { name: "Nauru", lat: -0.5477, lng: 166.9209, capital: "Yaren", continent: "oceania" },
  { name: "Nepal", lat: 27.7167, lng: 85.3667, capital: "Kathmandu", continent: "asia" },
  { name: "Netherlands", lat: 52.3667, lng: 4.9, capital: "Amsterdam", continent: "europe" },
  { name: "New Zealand", lat: -41.3, lng: 174.7833, capital: "Wellington", continent: "oceania" },
  { name: "Nicaragua", lat: 12.1364, lng: -86.2514, capital: "Managua", continent: "northAmerica" },
  { name: "Niger", lat: 13.5117, lng: 2.1253, capital: "Niamey", continent: "africa" },
  { name: "Nigeria", lat: 9.0556, lng: 7.4914, capital: "Abuja", continent: "africa" },
  { name: "North Korea", lat: 39.03, lng: 125.73, capital: "Pyongyang", continent: "asia" },
  { name: "North Macedonia", lat: 42, lng: 21.4333, capital: "Skopje", continent: "europe" },
  { name: "Norway", lat: 59.9111, lng: 10.7528, capital: "Oslo", continent: "europe" },
  { name: "Oman", lat: 23.6139, lng: 58.5922, capital: "Muscat", continent: "asia" },
  { name: "Pakistan", lat: 33.6844, lng: 73.0479, capital: "Islamabad", continent: "asia" },
  { name: "Palau", lat: 7.5, lng: 134.6167, capital: "Ngerulmud", continent: "oceania" },
  { name: "Panama", lat: 8.9833, lng: -79.5167, capital: "Panama City", continent: "northAmerica" },
  { name: "Papua New Guinea", lat: -9.4789, lng: 147.15, capital: "Port Moresby", continent: "oceania" },
  { name: "Paraguay", lat: -25.3, lng: -57.6333, capital: "Asunción", continent: "southAmerica" },
  { name: "Peru", lat: -12.05, lng: -77.05, capital: "Lima", continent: "southAmerica" },
  { name: "Philippines", lat: 14.6, lng: 120.9667, capital: "Manila", continent: "asia" },
  { name: "Poland", lat: 52.23, lng: 21.0111, capital: "Warsaw", continent: "europe" },
  { name: "Portugal", lat: 38.7083, lng: -9.1486, capital: "Lisbon", continent: "europe" },
  { name: "Qatar", lat: 25.3, lng: 51.5333, capital: "Doha", continent: "asia" },
  { name: "Romania", lat: 44.4, lng: 26.0833, capital: "Bucharest", continent: "europe" },
  { name: "Russia", lat: 55.75, lng: 37.6167, capital: "Moscow", continent: "europe" },
  { name: "Rwanda", lat: -1.9536, lng: 30.0606, capital: "Kigali", continent: "africa" },
  { name: "Saint Kitts and Nevis", lat: 17.3, lng: -62.7333, capital: "Basseterre", continent: "northAmerica" },
  { name: "Saint Lucia", lat: 14.0167, lng: -60.9833, capital: "Castries", continent: "northAmerica" },
  { name: "Saint Vincent and the Grenadines", lat: 13.16, lng: -61.2242, capital: "Kingstown", continent: "northAmerica" },
  { name: "Samoa", lat: -13.8333, lng: -171.75, capital: "Apia", continent: "oceania" },
  { name: "San Marino", lat: 43.932, lng: 12.4484, capital: "San Marino", continent: "europe" },
  { name: "Sao Tome and Principe", lat: 0.3333, lng: 6.7333, capital: "São Tomé", continent: "africa" },
  { name: "Saudi Arabia", lat: 24.65, lng: 46.7, capital: "Riyadh", continent: "asia" },
  { name: "Senegal", lat: 14.7319, lng: -17.4572, capital: "Dakar", continent: "africa" },
  { name: "Serbia", lat: 44.8167, lng: 20.4667, capital: "Belgrade", continent: "europe" },
  { name: "Seychelles", lat: -4.6167, lng: 55.45, capital: "Victoria", continent: "africa" },
  { name: "Sierra Leone", lat: 8.4833, lng: -13.2333, capital: "Freetown", continent: "africa" },
  { name: "Singapore", lat: 1.3, lng: 103.8, capital: "Singapore", continent: "asia" },
  { name: "Slovakia", lat: 48.1439, lng: 17.1097, capital: "Bratislava", continent: "europe" },
  { name: "Slovenia", lat: 46.05, lng: 14.5167, capital: "Ljubljana", continent: "europe" },
  { name: "Solomon Islands", lat: -9.4333, lng: 159.95, capital: "Honiara", continent: "oceania" },
  { name: "Somalia", lat: 2.0408, lng: 45.3425, capital: "Mogadishu", continent: "africa" },
  { name: "South Africa", lat: -25.7313, lng: 28.2184, capital: "Pretoria", continent: "africa" },
  { name: "South Korea", lat: 37.5667, lng: 127, capital: "Seoul", continent: "asia" },
  { name: "South Sudan", lat: 4.85, lng: 31.6, capital: "Juba", continent: "africa" },
  { name: "Spain", lat: 40.3833, lng: -3.7167, capital: "Madrid", continent: "europe" },
  { name: "Sri Lanka", lat: 6.9, lng: 79.9167, capital: "Colombo", continent: "asia" },
  { name: "Sudan", lat: 15.6031, lng: 32.5265, capital: "Khartoum", continent: "africa" },
  { name: "Suriname", lat: 5.8667, lng: -55.1667, capital: "Paramaribo", continent: "southAmerica" },
  { name: "Sweden", lat: 59.3294, lng: 18.0686, capital: "Stockholm", continent: "europe" },
  { name: "Switzerland", lat: 46.95, lng: 7.45, capital: "Bern", continent: "europe" },
  { name: "Syria", lat: 33.5131, lng: 36.2919, capital: "Damascus", continent: "asia" },
  { name: "Tajikistan", lat: 38.55, lng: 68.8, capital: "Dushanbe", continent: "asia" },
  { name: "Tanzania", lat: -6.8, lng: 39.2833, capital: "Dodoma", continent: "africa" },
  { name: "Thailand", lat: 13.75, lng: 100.5167, capital: "Bangkok", continent: "asia" },
  { name: "Togo", lat: 6.1167, lng: 1.2167, capital: "Lomé", continent: "africa" },
  { name: "Tonga", lat: -21.1347, lng: -175.2083, capital: "Nukuʻalofa", continent: "oceania" },
  { name: "Trinidad and Tobago", lat: 10.65, lng: -61.5167, capital: "Port of Spain", continent: "southAmerica" },
  { name: "Tunisia", lat: 36.8, lng: 10.1833, capital: "Tunis", continent: "africa" },
  { name: "Turkey", lat: 39.93, lng: 32.85, capital: "Ankara", continent: "asia" },
  { name: "Turkmenistan", lat: 37.95, lng: 58.3833, capital: "Ashgabat", continent: "asia" },
  { name: "Tuvalu", lat: -8.5167, lng: 179.2, capital: "Funafuti", continent: "oceania" },
  { name: "Uganda", lat: 0.3136, lng: 32.5811, capital: "Kampala", continent: "africa" },
  { name: "Ukraine", lat: 50.45, lng: 30.5236, capital: "Kyiv", continent: "europe" },
  { name: "United Arab Emirates", lat: 24.4667, lng: 54.3667, capital: "Abu Dhabi", continent: "asia" },
  { name: "United Kingdom", lat: 51.5072, lng: -0.1275, capital: "London", continent: "europe" },
  { name: "United States", lat: 38.895, lng: -77.0367, capital: "Washington, D.C.", continent: "northAmerica" },
  { name: "Uruguay", lat: -34.8833, lng: -56.1667, capital: "Montevideo", continent: "southAmerica" },
  { name: "Uzbekistan", lat: 41.3167, lng: 69.25, capital: "Tashkent", continent: "asia" },
  { name: "Vanuatu", lat: -17.75, lng: 168.3, capital: "Port Vila", continent: "oceania" },
  { name: "Vatican City", lat: 41.9033, lng: 12.4534, capital: "Vatican City", continent: "europe" },
  { name: "Venezuela", lat: 10.5, lng: -66.9, capital: "Caracas", continent: "southAmerica" },
  { name: "Vietnam", lat: 21.0245, lng: 105.8412, capital: "Hanoi", continent: "asia" },
  { name: "Yemen", lat: 15.35, lng: 44.2, capital: "Sana'a", continent: "asia" },
  { name: "Zambia", lat: -15.4167, lng: 28.2833, capital: "Lusaka", continent: "africa" },
  { name: "Zimbabwe", lat: -17.8292, lng: 31.0522, capital: "Harare", continent: "africa" }
];

interface CountryMarker {
  name: string;
  lat: number;
  lng: number;
  capital: string;
  color: string;
  continent: string;
}

interface GlobeComponentProps {
  onCountryClick?: (country: string) => void;
  className?: string;
}

export function GlobeComponent({ onCountryClick, className }: GlobeComponentProps) {
  const globeEl = useRef<any>();
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [hoveredCountry, setHoveredCountry] = useState<CountryMarker | null>(null);

  // Helper function to get color for a continent
  const getContinentColor = (continent: string): string => {
    return CONTINENT_COLORS[continent as keyof typeof CONTINENT_COLORS] || '#cccccc';
  };
  const [countryData] = useState<CountryMarker[]>(() => {
    return COUNTRIES.map(country => ({
      ...country,
      color: CONTINENT_COLORS[country.continent] || '#999999'
    }));
  });

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = isAutoRotating;
      globeEl.current.controls().autoRotateSpeed = 0.5;
      globeEl.current.controls().enableZoom = true;
      globeEl.current.controls().minDistance = 200;
      globeEl.current.controls().maxDistance = 600;
    }
  }, [isAutoRotating]);

  const handleCountryClick = (country: CountryMarker) => {
    if (onCountryClick) {
      onCountryClick(country.name);
    }
  };

  const handleGlobeClick = () => {
    setIsAutoRotating(prev => !prev);
  };

  return (
    <div className={`relative ${className}`} data-testid="globe-container">
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        htmlElementsData={countryData}
        htmlElement={(d: unknown) => {
          const country = d as CountryMarker;
          const isHovered = hoveredCountry?.name === country.name;
          const el = document.createElement("div");
          
          el.innerHTML = `
            <div 
              class="country-marker ${isHovered ? 'hovered' : ''}"
              style="
                position: relative;
                width: ${isHovered ? '14px' : '8px'};
                height: ${isHovered ? '14px' : '8px'};
                border-radius: 50%;
                background: ${getContinentColor(country.continent)};
                border: 2px solid white;
                box-shadow: 0 0 8px ${country.color};
                cursor: pointer;
                transition: all 0.2s ease;
                z-index: ${isHovered ? '100' : '1'};
                transform: ${isHovered ? 'scale(1.5)' : 'scale(1)'};
              "
              data-testid="marker-${country.name.toLowerCase().replace(/\s+/g, '-')}"
            >
              ${isHovered ? `
                <div 
                  style="
                    position: absolute;
                    bottom: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(0, 0, 0, 0.8);
                    color: white;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    white-space: nowrap;
                    margin-bottom: 8px;
                  "
                >
                  ${country.capital}, ${country.name}
                </div>
              ` : ''}
            </div>
          `;
          
          el.style.pointerEvents = "auto";
          el.style.cursor = "pointer";
          
          // Set up event handlers
          el.onmouseenter = () => setHoveredCountry(country);
          el.onmouseleave = () => setHoveredCountry(null);
          el.onclick = () => onCountryClick?.(country.name);
          
          return el;
        }}
        onGlobeClick={handleGlobeClick}
        atmosphereColor="rgba(100, 200, 255, 0.3)"
        atmosphereAltitude={0.25}
      />
    </div>
  );
}

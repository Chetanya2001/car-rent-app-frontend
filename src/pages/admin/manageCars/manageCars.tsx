import { useState, useMemo } from "react";
import AdminNavBar from "../../../components/AdminNavbar/AdminNavbar";
import "./manageCars.css";
interface Car {
  id: number;
  name: string;
  type: string;
  price: number;
  status: "Available" | "Rented";
  location: string;
}

const carData: Car[] = [
  {
    id: 1,
    name: "Tesla Model S",
    type: "Electric Sedan",
    price: 120,
    status: "Available",
    location: "Downtown",
  },
  {
    id: 2,
    name: "BMW X5",
    type: "Luxury SUV",
    price: 95,
    status: "Rented",
    location: "Airport",
  },
  {
    id: 3,
    name: "Mercedes C-Class",
    type: "Premium Sedan",
    price: 85,
    status: "Available",
    location: "City Center",
  },
  {
    id: 4,
    name: "Audi Q7",
    type: "Luxury SUV",
    price: 110,
    status: "Available",
    location: "Marina",
  },
  {
    id: 5,
    name: "Honda Civic",
    type: "Compact Car",
    price: 45,
    status: "Rented",
    location: "Suburbs",
  },
  {
    id: 6,
    name: "Toyota Camry",
    type: "Mid-size Sedan",
    price: 55,
    status: "Available",
    location: "Downtown",
  },
  {
    id: 7,
    name: "Range Rover Sport",
    type: "Luxury SUV",
    price: 150,
    status: "Available",
    location: "Airport",
  },
  {
    id: 8,
    name: "Nissan Altima",
    type: "Mid-size Sedan",
    price: 50,
    status: "Rented",
    location: "City Center",
  },
];

export default function ManageCars() {
  const [filter, setFilter] = useState<"All" | "Available" | "Rented">("All");
  const [typeFilter, setTypeFilter] = useState<string>("All Types");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filteredCars = useMemo(() => {
    return carData.filter((car) => {
      const matchesSearch =
        car.name.toLowerCase().includes(search.toLowerCase()) ||
        car.type.toLowerCase().includes(search.toLowerCase()) ||
        car.location.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "All" || car.status === filter;
      const matchesTypeFilter =
        typeFilter === "All Types" || car.type === typeFilter;
      return matchesSearch && matchesFilter && matchesTypeFilter;
    });
  }, [search, filter, typeFilter]);

  const paginatedCars = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredCars.slice(start, start + pageSize);
  }, [filteredCars, page]);

  const totalPages = Math.ceil(filteredCars.length / pageSize);

  const uniqueTypes = [
    "All Types",
    ...Array.from(new Set(carData.map((car) => car.type))),
  ];

  return (
    <>
      <AdminNavBar />
      <div className="zipd-mc-main_5832">
        <h1 className="zipd-mc-title_5832">Car Fleet Management</h1>

        <div className="zipd-mc-card_5832">
          <div className="zipd-mc-toolbar_5832">
            <input
              type="text"
              placeholder="🔍 Search cars by name, type, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="zipd-mc-search_5832"
            />

            <div className="zipd-mc-filters_5832">
              <select
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value as "All" | "Available" | "Rented");
                  setPage(1);
                }}
                className="zipd-mc-filterselect_5832"
              >
                <option value="All">All Status</option>
                <option value="Available">Available</option>
                <option value="Rented">Rented</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setPage(1);
                }}
                className="zipd-mc-filterselect_5832"
              >
                {uniqueTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <button className="zipd-mc-addbtn_5832">Add Vehicle</button>
          </div>

          <table className="zipd-mc-table_5832">
            <thead>
              <tr>
                <th>Vehicle Details</th>
                <th>Daily Rate</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCars.length > 0 ? (
                paginatedCars.map((car, index) => (
                  <tr
                    key={car.id}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <td data-label="Vehicle">
                      <div>
                        <div className="zipd-mc-carname_5832">{car.name}</div>
                        <div className="zipd-mc-cartype_5832">{car.type}</div>
                      </div>
                    </td>
                    <td data-label="Rate">
                      <span className="zipd-mc-price_5832">{car.price}</span>
                    </td>
                    <td data-label="Location">
                      <span className="zipd-mc-location_5832">
                        {car.location}
                      </span>
                    </td>
                    <td data-label="Status">
                      <span
                        className={`zipd-mc-status_5832 ${
                          car.status === "Available"
                            ? "zipd-mc-status-avail_5832"
                            : "zipd-mc-status-rented_5832"
                        }`}
                      >
                        {car.status}
                      </span>
                    </td>
                    <td data-label="Actions">
                      <div className="zipd-mc-actions_5832">
                        <button
                          className="zipd-mc-iconbtn_5832"
                          title="Edit Vehicle"
                        >
                          ✏️
                        </button>
                        <button
                          className="zipd-mc-iconbtn_5832"
                          title="View Details"
                        >
                          👁️
                        </button>
                        <button
                          className="zipd-mc-iconbtn_5832"
                          title="Delete Vehicle"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>
                    <div className="zipd-mc-empty_5832">
                      <h3>No vehicles found</h3>
                      <p>Try adjusting your search criteria or filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="zipd-mc-pagination_5832">
            <div className="zipd-mc-paginationtext_5832">
              <span className="zipd-mc-results-count_5832">
                {filteredCars.length} vehicle
                {filteredCars.length !== 1 ? "s" : ""} found
              </span>
              <span className="zipd-mc-page-number_5832">
                Page {page} of {totalPages || 1}
              </span>
            </div>

            <div className="zipd-mc-paginationbtns_5832">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
              >
                ← Previous
              </button>
              <button
                disabled={page === totalPages || totalPages === 0}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

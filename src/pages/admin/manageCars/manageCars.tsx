import { useState, useMemo } from "react";
import AdminNavBar from "../../../components/AdminNavbar/AdminNavbar";
import "./manageCars.css";

interface Car {
  id: number; // Car ID
  carNo: string; // Car No
  name: string; // Make / Model
  type: string; // Type (e.g., Sedan)
  price: number; // Hourly price
  status: "Available" | "Rented";
  location: string;
  year: number; // Year of make
  month: string;
  fuelType: string; // Fuel Type
  seatingCapacity: number; // Seating capacity
  hostedBy: string; // Hosted by
  isVerified: boolean; // Is Verified
  ratings: number; // Ratings (e.g., 1-5)
}

const carData: Car[] = [];

export default function ManageCars() {
  const [filter, setFilter] = useState<"All" | "Available" | "Rented">("All");
  const [typeFilter, setTypeFilter] = useState<string>("All Types");
  const [yearFilter, setYearFilter] = useState<string>("All Years");
  const [monthFilter, setMonthFilter] = useState<string>("All Months");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // Unique dropdown values
  const uniqueTypes = ["All Types", ...new Set(carData.map((car) => car.type))];
  const uniqueYears = [
    "All Years",
    ...new Set(carData.map((car) => car.year.toString())),
  ];
  const uniqueMonths = [
    "All Months",
    ...new Set(carData.map((car) => car.month)),
  ];

  const filteredCars = useMemo(() => {
    return carData.filter((car) => {
      const matchesSearch =
        car.name.toLowerCase().includes(search.toLowerCase()) ||
        car.type.toLowerCase().includes(search.toLowerCase()) ||
        car.location.toLowerCase().includes(search.toLowerCase());

      const matchesFilter = filter === "All" || car.status === filter;
      const matchesTypeFilter =
        typeFilter === "All Types" || car.type === typeFilter;
      const matchesYearFilter =
        yearFilter === "All Years" || car.year.toString() === yearFilter;
      const matchesMonthFilter =
        monthFilter === "All Months" || car.month === monthFilter;

      return (
        matchesSearch &&
        matchesFilter &&
        matchesTypeFilter &&
        matchesYearFilter &&
        matchesMonthFilter
      );
    });
  }, [search, filter, typeFilter, yearFilter, monthFilter]);

  const paginatedCars = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredCars.slice(start, start + pageSize);
  }, [filteredCars, page]);

  const totalPages = Math.ceil(filteredCars.length / pageSize);

  return (
    <>
      <AdminNavBar />
      <div className="zipd-mc-main_5832">
        <h1 className="zipd-mc-title_5832">Car Fleet Management</h1>

        <div className="zipd-mc-card_5832">
          {/* 🔍 Filters */}
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

              <select
                value={yearFilter}
                onChange={(e) => {
                  setYearFilter(e.target.value);
                  setPage(1);
                }}
                className="zipd-mc-filterselect_5832"
              >
                {uniqueYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <select
                value={monthFilter}
                onChange={(e) => {
                  setMonthFilter(e.target.value);
                  setPage(1);
                }}
                className="zipd-mc-filterselect_5832"
              >
                {uniqueMonths.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            <button className="zipd-mc-addbtn_5832">Add Vehicle</button>
          </div>

          {/* 🚘 Car Table */}
          <table className="zipd-mc-table_5832">
            <thead>
              <tr>
                <th>Car ID</th>
                <th>Car No</th>
                <th>Make / Model</th>
                <th>Fuel Type</th>
                <th>Seating</th>
                <th>Year</th>
                <th>Month</th>
                <th>Hourly Price</th>
                <th>Location</th>
                <th>Hosted by</th>
                <th>Verified</th>
                <th>Status</th>
                <th>Ratings</th>
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
                    <td>{car.id}</td>
                    <td>{car.carNo}</td>
                    <td>
                      <div>
                        <div className="zipd-mc-carname_5832">{car.name}</div>
                        <div className="zipd-mc-cartype_5832">{car.type}</div>
                      </div>
                    </td>
                    <td>{car.fuelType}</td>
                    <td>{car.seatingCapacity}</td>
                    <td>{car.year}</td>
                    <td>{car.month}</td>
                    <td>
                      <span className="zipd-mc-price_5832">{car.price}</span>
                    </td>
                    <td>
                      <span className="zipd-mc-location_5832">
                        {car.location}
                      </span>
                    </td>
                    <td>{car.hostedBy}</td>
                    <td>
                      {car.isVerified ? <span>✅</span> : <span>❌</span>}
                    </td>
                    <td>
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
                    <td>{car.ratings.toFixed(1)}</td>
                    <td>
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
                  <td colSpan={14}>
                    <div className="zipd-mc-empty_5832">
                      <h3>No vehicles found</h3>
                      <p>Try adjusting your search criteria or filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* 📄 Pagination */}
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
                onClick={() => setPage((p) => p - 1)}
              >
                ← Previous
              </button>
              <button
                disabled={page === totalPages || totalPages === 0}
                onClick={() => setPage((p) => p + 1)}
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

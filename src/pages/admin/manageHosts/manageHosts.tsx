import { useState, useMemo } from "react";
import AdminNavBar from "../../../components/AdminNavbar/AdminNavbar";
import "./manageHosts.css";

interface Host {
  id: number;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  id1Verified: boolean; // ID 1 verified
  status: "Active" | "Inactive" | "Pending";
  joinDate: string;
  rating: number;
  // old fields removed to avoid duplication: name, contact, carsListed, location
  action?: string; // For UI action placeholders if needed
}

const hostData: Host[] = [
  {
    id: 1,
    firstName: "Ethan",
    lastName: "Carter",
    address: "123 Main St",
    city: "Downtown",
    id1Verified: true,
    status: "Active",
    joinDate: "2024-01-15",
    rating: 4.8,
  },
  {
    id: 2,
    firstName: "Olivia",
    lastName: "Bennett",
    address: "456 Ocean Dr",
    city: "Marina",
    id1Verified: true,
    status: "Active",
    joinDate: "2023-11-22",
    rating: 4.9,
  },
  {
    id: 3,
    firstName: "Noah",
    lastName: "Thompson",
    address: "789 Maple Ave",
    city: "Suburbs",
    id1Verified: false,
    status: "Inactive",
    joinDate: "2024-02-08",
    rating: 4.2,
  },
  {
    id: 4,
    firstName: "Ava",
    lastName: "Harper",
    address: "321 Center Blvd",
    city: "City Center",
    id1Verified: true,
    status: "Active",
    joinDate: "2023-12-10",
    rating: 4.7,
  },
  {
    id: 5,
    firstName: "Liam",
    lastName: "Foster",
    address: "654 Airport Rd",
    city: "Airport",
    id1Verified: false,
    status: "Pending",
    joinDate: "2024-03-01",
    rating: 4.0,
  },
  {
    id: 6,
    firstName: "Emma",
    lastName: "Wilson",
    address: "987 Central St",
    city: "Downtown",
    id1Verified: true,
    status: "Active",
    joinDate: "2023-10-15",
    rating: 4.9,
  },
  {
    id: 7,
    firstName: "Mason",
    lastName: "Davis",
    address: "741 Bayview Dr",
    city: "Marina",
    id1Verified: false,
    status: "Inactive",
    joinDate: "2024-01-28",
    rating: 3.8,
  },
];

export default function ManageHosts() {
  const [filter, setFilter] = useState<
    "All" | "Active" | "Inactive" | "Pending"
  >("All");
  const [dateFilter, setDateFilter] = useState<string>("All Dates");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filteredHosts = useMemo(() => {
    return hostData.filter((host) => {
      const matchesSearch =
        host.firstName.toLowerCase().includes(search.toLowerCase()) ||
        host.lastName.toLowerCase().includes(search.toLowerCase()) ||
        host.address.toLowerCase().includes(search.toLowerCase()) ||
        host.city.toLowerCase().includes(search.toLowerCase());

      const matchesFilter = filter === "All" || host.status === filter;

      let matchesDateFilter = true;
      if (dateFilter !== "All Dates") {
        const hostYear = new Date(host.joinDate).getFullYear();
        const currentYear = new Date().getFullYear();

        if (dateFilter === "This Year") {
          matchesDateFilter = hostYear === currentYear;
        } else if (dateFilter === "Last Year") {
          matchesDateFilter = hostYear === currentYear - 1;
        }
      }

      return matchesSearch && matchesFilter && matchesDateFilter;
    });
  }, [search, filter, dateFilter]);

  const paginatedHosts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredHosts.slice(start, start + pageSize);
  }, [filteredHosts, page]);

  const totalPages = Math.ceil(filteredHosts.length / pageSize);

  const dateOptions = ["All Dates", "This Year", "Last Year"];

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="star-full">
          ★
        </span>
      );
    }
    if (hasHalfStar) {
      stars.push(
        <span key="half" className="star-half">
          ☆
        </span>
      );
    }
    return stars;
  };

  return (
    <>
      <AdminNavBar />

      <div className="zipd-mc-main_5832">
        <h1 className="zipd-mc-title_5832">Host Management</h1>

        <div className="zipd-mc-card_5832">
          <div className="zipd-mc-toolbar_5832">
            <input
              type="text"
              placeholder="🔍 Search hosts by first name, last name, address or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="zipd-mc-search_5832"
            />

            <div className="zipd-mc-filters_5832">
              <select
                value={filter}
                onChange={(e) => {
                  setFilter(
                    e.target.value as "All" | "Active" | "Inactive" | "Pending"
                  );
                  setPage(1);
                }}
                className="zipd-mc-filterselect_5832"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
              </select>

              <select
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value);
                  setPage(1);
                }}
                className="zipd-mc-filterselect_5832"
              >
                {dateOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <button className="zipd-mc-addbtn_5832">Add Host</button>
          </div>

          <table className="zipd-mc-table_5832">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Address</th>
                <th>City</th>
                <th>ID 1 Verified</th>
                <th>Status</th>
                <th>Ratings</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedHosts.length > 0 ? (
                paginatedHosts.map((host, index) => (
                  <tr
                    key={host.id}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <td data-label="First Name">{host.firstName}</td>
                    <td data-label="Last Name">{host.lastName}</td>
                    <td data-label="Address">{host.address}</td>
                    <td data-label="City">{host.city}</td>
                    <td data-label="ID 1 Verified">
                      {host.id1Verified ? "✅" : "❌"}
                    </td>
                    <td data-label="Status">
                      <span
                        className={`zipd-mc-status_5832 zipd-mc-status-${host.status.toLowerCase()}_5832`}
                      >
                        {host.status}
                      </span>
                    </td>
                    <td data-label="Ratings">
                      <div className="zipd-mc-rating_5832">
                        {renderStars(host.rating)}
                        <span>({host.rating.toFixed(1)})</span>
                      </div>
                    </td>
                    <td data-label="Actions">
                      <div className="zipd-mc-actions_5832">
                        <button
                          className="zipd-mc-iconbtn_5832"
                          title="Edit Host"
                        >
                          ✏️
                        </button>
                        <button
                          className="zipd-mc-iconbtn_5832"
                          title="View Profile"
                        >
                          👁️
                        </button>
                        <button
                          className="zipd-mc-iconbtn_5832 delete"
                          title="Delete Host"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8}>
                    <div className="zipd-mc-empty_5832">
                      <h3>No hosts found</h3>
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
                {filteredHosts.length} host
                {filteredHosts.length !== 1 ? "s" : ""} found
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

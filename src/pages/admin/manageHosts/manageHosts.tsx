import { useState, useMemo } from "react";
import AdminNavBar from "../../../components/AdminNavbar/AdminNavbar";
import "./manageHosts.css";

interface Host {
  id: number;
  name: string;
  contact: string;
  carsListed: number;
  status: "Active" | "Inactive" | "Pending";
  joinDate: string;
  location: string;
  rating: number;
}

const hostData: Host[] = [
  {
    id: 1,
    name: "Ethan Carter",
    contact: "ethan.carter@email.com",
    carsListed: 3,
    status: "Active",
    joinDate: "2024-01-15",
    location: "Downtown",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Olivia Bennett",
    contact: "olivia.bennett@email.com",
    carsListed: 5,
    status: "Active",
    joinDate: "2023-11-22",
    location: "Marina",
    rating: 4.9,
  },
  {
    id: 3,
    name: "Noah Thompson",
    contact: "noah.thompson@email.com",
    carsListed: 2,
    status: "Inactive",
    joinDate: "2024-02-08",
    location: "Suburbs",
    rating: 4.2,
  },
  {
    id: 4,
    name: "Ava Harper",
    contact: "ava.harper@email.com",
    carsListed: 4,
    status: "Active",
    joinDate: "2023-12-10",
    location: "City Center",
    rating: 4.7,
  },
  {
    id: 5,
    name: "Liam Foster",
    contact: "liam.foster@email.com",
    carsListed: 1,
    status: "Pending",
    joinDate: "2024-03-01",
    location: "Airport",
    rating: 4.0,
  },
  {
    id: 6,
    name: "Emma Wilson",
    contact: "emma.wilson@email.com",
    carsListed: 6,
    status: "Active",
    joinDate: "2023-10-15",
    location: "Downtown",
    rating: 4.9,
  },
  {
    id: 7,
    name: "Mason Davis",
    contact: "mason.davis@email.com",
    carsListed: 3,
    status: "Inactive",
    joinDate: "2024-01-28",
    location: "Marina",
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
        host.name.toLowerCase().includes(search.toLowerCase()) ||
        host.contact.toLowerCase().includes(search.toLowerCase()) ||
        host.location.toLowerCase().includes(search.toLowerCase());
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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
              placeholder="🔍 Search hosts by name, email, or location..."
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
                <th>Host Details</th>
                <th>Cars Listed</th>
                <th>Location</th>
                <th>Join Date</th>
                <th>Rating</th>
                <th>Status</th>
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
                    <td data-label="Host">
                      <div>
                        <div className="zipd-mc-hostname_5832">{host.name}</div>
                        <div className="zipd-mc-hostcontact_5832">
                          {host.contact}
                        </div>
                      </div>
                    </td>
                    <td data-label="Cars">
                      <span className="zipd-mc-carslisted_5832">
                        {host.carsListed}
                      </span>
                    </td>
                    <td data-label="Location">
                      <span className="zipd-mc-location_5832">
                        {host.location}
                      </span>
                    </td>
                    <td data-label="Join Date">
                      <span className="zipd-mc-joindate_5832">
                        {formatDate(host.joinDate)}
                      </span>
                    </td>
                    <td data-label="Rating">
                      <div className="zipd-mc-rating_5832">
                        {renderStars(host.rating)}
                        <span>({host.rating})</span>
                      </div>
                    </td>
                    <td data-label="Status">
                      <span
                        className={`zipd-mc-status_5832 zipd-mc-status-${host.status.toLowerCase()}_5832`}
                      >
                        {host.status}
                      </span>
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
                  <td colSpan={7}>
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

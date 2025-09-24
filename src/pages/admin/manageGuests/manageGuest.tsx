import { useState, useMemo } from "react";
import AdminNavBar from "../../../components/AdminNavbar/AdminNavbar";
import "./manageGuest.css";

interface Guest {
  id: number;
  name: string;
  contact: string;
  rentals: number;
  status: "Active" | "Inactive";
}

const guestData: Guest[] = [
  {
    id: 1,
    name: "Ethan Carter",
    contact: "ethan.carter@email.com",
    rentals: 5,
    status: "Active",
  },
  {
    id: 2,
    name: "Olivia Bennett",
    contact: "olivia.bennett@email.com",
    rentals: 3,
    status: "Active",
  },
  {
    id: 3,
    name: "Noah Thompson",
    contact: "noah.thompson@email.com",
    rentals: 2,
    status: "Inactive",
  },
  {
    id: 4,
    name: "Ava Rodriguez",
    contact: "ava.rodriguez@email.com",
    rentals: 7,
    status: "Active",
  },
  {
    id: 5,
    name: "Liam Harper",
    contact: "liam.harper@email.com",
    rentals: 1,
    status: "Inactive",
  },
  {
    id: 6,
    name: "Emma Wilson",
    contact: "emma.wilson@email.com",
    rentals: 4,
    status: "Active",
  },
  {
    id: 7,
    name: "Mason Davis",
    contact: "mason.davis@email.com",
    rentals: 6,
    status: "Inactive",
  },
];

export default function ManageGuests() {
  const [filter, setFilter] = useState<"All" | "Active" | "Inactive">("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filteredGuests = useMemo(() => {
    return guestData.filter((guest) => {
      const matchesSearch =
        guest.name.toLowerCase().includes(search.toLowerCase()) ||
        guest.contact.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "All" || guest.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  const paginatedGuests = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredGuests.slice(start, start + pageSize);
  }, [filteredGuests, page]);

  const totalPages = Math.ceil(filteredGuests.length / pageSize);

  return (
    <>
      <AdminNavBar />

      <div className="manage-guests-container">
        <div className="manage-guests-header">
          <h1>Guest Management</h1>
          <button className="add-btn">
            <span>+</span> Add Guest
          </button>
        </div>

        <div className="content-card">
          {/* Search & Filter */}
          <div className="filters">
            <input
              type="text"
              placeholder="🔍 Search guests by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <div className="filter-buttons">
              {["All", "Active", "Inactive"].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setFilter(status as "All" | "Active" | "Inactive");
                    setPage(1);
                  }}
                  className={`filter-btn ${filter === status ? "active" : ""}`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="table-container">
            <table className="guest-table">
              <thead>
                <tr>
                  <th>Guest Name</th>
                  <th>Contact Information</th>
                  <th>Total Rentals</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedGuests.length > 0 ? (
                  paginatedGuests.map((guest, index) => (
                    <tr
                      key={guest.id}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <td>
                        <div className="guest-name">{guest.name}</div>
                      </td>
                      <td>
                        <div className="guest-contact">{guest.contact}</div>
                      </td>
                      <td>
                        <span className="rental-count">{guest.rentals}</span>
                      </td>
                      <td>
                        <span
                          className={`status ${guest.status.toLowerCase()}`}
                        >
                          {guest.status}
                        </span>
                      </td>
                      <td>
                        <div className="actions">
                          <button className="edit" title="Edit Guest">
                            ✏️
                          </button>
                          <button className="delete" title="Delete Guest">
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5}>
                      <div className="no-data">
                        <div>No guests found matching your criteria</div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination">
            <div className="pagination-info">
              <div className="results-count">
                {filteredGuests.length} guest
                {filteredGuests.length !== 1 ? "s" : ""} found
              </div>
              <div className="page-number">
                Page {page} of {totalPages || 1}
              </div>
            </div>
            <div className="pagination-controls">
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

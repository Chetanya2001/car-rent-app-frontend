import { useState, useMemo, useEffect } from "react";
import AdminNavBar from "../../../components/AdminNavbar/AdminNavbar";
import { getAllUsers } from "./../../../services/admin";
import type { User } from "./../../../services/admin";
import "./manageGuest.css";

export default function ManageGuests() {
  const [guests, setGuests] = useState<User[]>([]);
  const [filter, setFilter] = useState<"All" | "Active" | "Inactive">("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // ✅ Fetch guest users
  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const users = await getAllUsers(); // no need to pass token manually
        const onlyGuests = users.filter((u) => u.role === "guest");
        setGuests(onlyGuests);
      } catch (error) {
        console.error("Failed to load guests:", error);
      }
    };

    fetchGuests();
  }, []);

  // ✅ Filter guests
  const filteredGuests = useMemo(() => {
    return guests.filter((guest) => {
      const matchesSearch =
        guest.first_name.toLowerCase().includes(search.toLowerCase()) ||
        guest.last_name.toLowerCase().includes(search.toLowerCase()) ||
        guest.email.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" ||
        (filter === "Active" && guest.is_verified) ||
        (filter === "Inactive" && !guest.is_verified);

      return matchesSearch && matchesFilter;
    });
  }, [search, filter, guests]);

  // ✅ Paginate
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
                        <div className="guest-name">
                          {guest.first_name} {guest.last_name}
                        </div>
                      </td>
                      <td>
                        <div className="guest-contact">{guest.email}</div>
                        <div className="guest-contact">{guest.phone}</div>
                      </td>
                      <td>
                        <span
                          className={`status ${
                            guest.is_verified ? "active" : "inactive"
                          }`}
                        >
                          {guest.is_verified ? "Active" : "Inactive"}
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

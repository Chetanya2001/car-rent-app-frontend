import { useState, useMemo, useEffect } from "react";
import AdminNavBar from "../../../components/AdminNavbar/AdminNavbar";
import { getAllUsers } from "./../../../services/admin";
import "./manageGuest.css";

interface Guest {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  id1Verified: boolean;
  id2Verified: boolean;
  isVerified: boolean; // corresponds to existing verified status
  ratings: number;
  action?: string;
}

export default function ManageGuests() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [filter, setFilter] = useState<"All" | "Active" | "Inactive">("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const users = await getAllUsers();
        const onlyGuests = users.filter((u) => u.role === "guest");
        const mappedGuests: Guest[] = onlyGuests.map((guest) => ({
          id: guest.id,
          firstName: guest.first_name,
          lastName: guest.last_name,
          email: guest.email,
          phone: guest.phone || "N/A",
          id1Verified: false, // temporary default, set later
          id2Verified: false, // temporary default, set later
          isVerified: guest.is_verified,
          ratings: 0, // temporary default, set later
        }));
        setGuests(mappedGuests);
      } catch (error) {
        console.error("Failed to load guests:", error);
      }
    };
    fetchGuests();
  }, []);

  const filteredGuests = useMemo(() => {
    return guests.filter((guest) => {
      const matchesSearch =
        guest.firstName.toLowerCase().includes(search.toLowerCase()) ||
        guest.lastName.toLowerCase().includes(search.toLowerCase()) ||
        guest.email.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" ||
        (filter === "Active" && guest.isVerified) ||
        (filter === "Inactive" && !guest.isVerified);

      return matchesSearch && matchesFilter;
    });
  }, [search, filter, guests]);

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

          <div className="table-container">
            <table className="guest-table">
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Phone no</th>
                  <th>ID 1 Verified</th>
                  <th>ID 2 Verified</th>
                  <th>Status</th>
                  <th>Ratings</th>
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
                      <td>{guest.firstName}</td>
                      <td>{guest.lastName}</td>
                      <td>{guest.email}</td>
                      <td>{guest.phone}</td>
                      <td>{guest.id1Verified ? "✅" : "❌"}</td>
                      <td>{guest.id2Verified ? "✅" : "❌"}</td>
                      <td>
                        <span
                          className={`status ${
                            guest.isVerified ? "active" : "inactive"
                          }`}
                        >
                          {guest.isVerified ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>{guest.ratings.toFixed(1)}</td>
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
                    <td colSpan={9}>
                      <div className="no-data">
                        <div>No guests found matching your criteria</div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

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

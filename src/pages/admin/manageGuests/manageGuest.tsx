import { useState, useMemo, useEffect } from "react";
import AdminNavBar from "../../../components/AdminNavbar/AdminNavbar";
import { getAllUsers, deleteUser, updateUser } from "./../../../services/admin";
import "./manageGuest.css";

interface Guest {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  id1Verified: boolean;
  id2Verified: boolean;
  isVerified: boolean;
  ratings: number;
  action?: string;
}

export default function ManageGuests() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [filter, setFilter] = useState<"All" | "Active" | "Inactive">("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const pageSize = 5;
  const token = localStorage.getItem("token") || "";

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
          id1Verified: false,
          id2Verified: false,
          isVerified: guest.is_verified,
          ratings: 0,
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

  const handleDelete = async (userId: number) => {
    if (!window.confirm("Are you sure you want to delete this guest?")) return;

    try {
      await deleteUser(token, userId.toString());
      setGuests((prev) => prev.filter((guest) => guest.id !== userId));
      if ((page - 1) * pageSize >= filteredGuests.length - 1 && page > 1) {
        setPage(page - 1);
      }
    } catch (error) {
      console.error("Failed to delete guest:", error);
      alert("Failed to delete guest. Please try again.");
    }
  };

  const handleEditClick = (guest: Guest) => {
    setEditingGuest(guest);
    setIsEditing(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingGuest) return;
    const { name, value } = e.target;
    setEditingGuest((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSaveEdit = async () => {
    if (!editingGuest) return;
    try {
      const updated = await updateUser(token, editingGuest.id.toString(), {
        first_name: editingGuest.firstName,
        last_name: editingGuest.lastName,
        email: editingGuest.email,
        phone: editingGuest.phone,
        is_verified: editingGuest.isVerified,
      });

      setGuests((prev) =>
        prev.map((g) =>
          g.id === editingGuest.id
            ? {
                ...g,
                firstName: updated.first_name,
                lastName: updated.last_name,
                email: updated.email,
                phone: updated.phone,
                isVerified: updated.is_verified,
              }
            : g
        )
      );

      setIsEditing(false);
      alert("Guest updated successfully!");
    } catch (error) {
      console.error("Failed to update guest:", error);
      alert("Update failed. Please try again.");
    }
  };

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
                      <td>{guest.firstName}</td>
                      <td>{guest.lastName}</td>
                      <td>{guest.email}</td>
                      <td>{guest.phone}</td>
                      <td>
                        <span
                          className={`status ${
                            guest.isVerified ? "active" : "inactive"
                          }`}
                        >
                          {guest.isVerified ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <div className="actions">
                          <button
                            className="edit"
                            title="Edit Guest"
                            onClick={() => handleEditClick(guest)}
                          >
                            ✏️
                          </button>
                          <button
                            className="delete"
                            title="Delete Guest"
                            onClick={() => handleDelete(guest.id)}
                          >
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

      {/* ✅ Guest Edit Modal with unique classes */}
      {isEditing && editingGuest && (
        <div
          className="guest-edit-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsEditing(false);
          }}
        >
          <div className="guest-edit-box">
            <h2>Edit Guest Details</h2>

            <label>
              First Name:
              <input
                type="text"
                name="firstName"
                value={editingGuest.firstName}
                onChange={handleInputChange}
              />
            </label>

            <label>
              Last Name:
              <input
                type="text"
                name="lastName"
                value={editingGuest.lastName}
                onChange={handleInputChange}
              />
            </label>

            <label>
              Email:
              <input
                type="email"
                name="email"
                value={editingGuest.email}
                onChange={handleInputChange}
              />
            </label>

            <label>
              Phone:
              <input
                type="text"
                name="phone"
                value={editingGuest.phone}
                onChange={handleInputChange}
              />
            </label>

            <label>
              Status:
              <select
                name="isVerified"
                value={editingGuest.isVerified ? "true" : "false"}
                onChange={(e) =>
                  setEditingGuest((prev) =>
                    prev
                      ? { ...prev, isVerified: e.target.value === "true" }
                      : null
                  )
                }
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </label>

            <div className="guest-edit-buttons">
              <button onClick={handleSaveEdit}>Save</button>
              <button
                className="guest-edit-cancel"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

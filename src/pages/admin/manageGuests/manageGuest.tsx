"use client";
import { useEffect, useMemo, useState } from "react";
import { getAllUsers, deleteUser, updateUser } from "../../../services/admin";
import AdminNavBar from "../../../components/AdminNavbar/AdminNavbar";
import toast, { Toaster } from "react-hot-toast";
import "./manageGuest.css";

type Guest = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: "admin" | "host" | "guest";
  is_verified: boolean;
  hasPendingVerification: boolean;
};

const ManageGuests = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const guestsPerPage = 8;

  // ✅ Fetch guests
  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const res = await getAllUsers();
        setGuests(
          res
            .filter((u: any) => u.role === "guest")
            .map((u: any) => ({
              id: u.id,
              first_name: u.first_name,
              last_name: u.last_name,
              email: u.email,
              phone: u.phone,
              role: "guest",
              is_verified: u.is_verified,
              hasPendingVerification: u.hasPendingVerification ?? false,
            })),
        );
      } catch (err) {
        console.error("Failed to fetch guests:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGuests();
  }, []);

  // ✅ Safe filtering
  const filteredGuests = useMemo(() => {
    return guests.filter((guest) => {
      const fullName = `${guest.first_name || ""} ${
        guest.last_name || ""
      }`.toLowerCase();
      const email = guest.email?.toLowerCase() || "";
      const query = searchQuery.toLowerCase();
      return fullName.includes(query) || email.includes(query);
    });
  }, [guests, searchQuery]);

  // ✅ Pagination
  const totalPages = Math.ceil(filteredGuests.length / guestsPerPage);
  const displayedGuests = filteredGuests.slice(
    (currentPage - 1) * guestsPerPage,
    currentPage * guestsPerPage,
  );

  // ✅ Edit guest
  const handleEditGuest = (guest: Guest) => {
    setEditingGuest(guest);
    setIsEditing(true);
  };

  // ✅ Save edit
  const handleSaveEdit = async () => {
    if (!editingGuest) return;
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login again");
      return;
    }

    try {
      await updateUser(token, String(editingGuest.id), {
        first_name: editingGuest.first_name,
        last_name: editingGuest.last_name,
        email: editingGuest.email,
        phone: editingGuest.phone,
      });

      setGuests((prev) =>
        prev.map((g) =>
          g.id === editingGuest.id
            ? {
                ...g, // keep Guest-only fields
                first_name: editingGuest.first_name,
                last_name: editingGuest.last_name,
                email: editingGuest.email,
                phone: editingGuest.phone,
              }
            : g,
        ),
      );

      toast.success("Guest updated successfully!");
      setIsEditing(false);
      setEditingGuest(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update guest");
    }
  };

  // ✅ Delete guest
  const handleDeleteGuest = async (id: number) => {
    if (!confirm("Are you sure you want to delete this guest?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login again");
      return;
    }

    try {
      await deleteUser(token, String(id));
      setGuests((prev) => prev.filter((g) => g.id !== id));
      toast.success("Guest deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete guest");
    }
  };

  if (loading) return <div className="loading">Loading guests...</div>;

  return (
    <>
      <AdminNavBar />
      <Toaster position="top-right" />
      <div className="manage-guests-container">
        {/* Header */}
        <div className="manage-guests-header">
          <h1>Manage Guests</h1>
          <button
            className="add-btn"
            onClick={() => toast("Feature coming soon!")}
          >
            + Add Guest
          </button>
        </div>

        <div className="content-card">
          {/* Filters */}
          <div className="filters">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Table */}
          <div className="table-container">
            <table className="guest-table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Verified Guest</th>
                  <th>Document Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedGuests.length > 0 ? (
                  displayedGuests.map((guest) => (
                    <tr key={guest.id}>
                      <td className="guest-name">
                        {guest.first_name} {guest.last_name}
                      </td>
                      <td className="guest-contact">{guest.email}</td>
                      <td>{guest.phone}</td>
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
                        {guest.hasPendingVerification ? (
                          <span className="doc-badge pending">
                            🟠 Pending Review
                          </span>
                        ) : (
                          <span className="doc-badge verified">
                            🟢 Verified
                          </span>
                        )}
                      </td>

                      <td className="actions">
                        <button
                          className="edit"
                          onClick={() => handleEditGuest(guest)}
                        >
                          ✏️
                        </button>
                        <button
                          className="delete"
                          onClick={() => handleDeleteGuest(guest.id)}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="no-data">
                      No guests found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <div className="pagination-info">
                <span className="results-count">
                  Showing {displayedGuests.length} of {filteredGuests.length}
                </span>
              </div>
              <div className="pagination-controls">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Prev
                </button>
                <span className="page-number">{currentPage}</span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {isEditing && editingGuest && (
          <div
            className="guest-edit-overlay"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsEditing(false);
            }}
          >
            <div className="guest-edit-box">
              <h2>Edit Guest</h2>
              <label>First Name</label>
              <input
                type="text"
                value={editingGuest.first_name}
                onChange={(e) =>
                  setEditingGuest({
                    ...editingGuest,
                    first_name: e.target.value,
                  })
                }
              />

              <label>Last Name</label>
              <input
                type="text"
                value={editingGuest.last_name}
                onChange={(e) =>
                  setEditingGuest({
                    ...editingGuest,
                    last_name: e.target.value,
                  })
                }
              />

              <label>Email</label>
              <input
                type="text"
                value={editingGuest.email}
                onChange={(e) =>
                  setEditingGuest({
                    ...editingGuest,
                    email: e.target.value,
                  })
                }
              />

              <label>Phone</label>
              <input
                type="text"
                value={editingGuest.phone}
                onChange={(e) =>
                  setEditingGuest({
                    ...editingGuest,
                    phone: e.target.value,
                  })
                }
              />

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
      </div>
    </>
  );
};

export default ManageGuests;

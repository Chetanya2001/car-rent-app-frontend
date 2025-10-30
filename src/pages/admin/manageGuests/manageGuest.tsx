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
        setGuests(res.filter((u) => u.role === "guest"));
      } catch (err) {
        console.error("Failed to fetch guests:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGuests();
  }, []);

  // ✅ Filter guests safely
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

  // ✅ Pagination logic
  const totalPages = Math.ceil(filteredGuests.length / guestsPerPage);
  const displayedGuests = filteredGuests.slice(
    (currentPage - 1) * guestsPerPage,
    currentPage * guestsPerPage
  );

  // ✅ Edit guest handler
  const handleEditGuest = (guest: Guest) => {
    setEditingGuest(guest);
    setIsEditing(true);
  };

  // ✅ Save guest update
  const handleSaveEdit = async () => {
    if (!editingGuest) return;
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication error. Please log in again.");
      return;
    }

    try {
      const updatedGuest = await updateUser(token, String(editingGuest.id), {
        first_name: editingGuest.first_name,
        last_name: editingGuest.last_name,
        email: editingGuest.email,
        phone: editingGuest.phone,
      });

      setGuests((prev) =>
        prev.map((g) => (g.id === updatedGuest.id ? updatedGuest : g))
      );

      setIsEditing(false);
      setEditingGuest(null);
      toast.success("Guest updated successfully!");
    } catch (err) {
      console.error("Failed to update guest:", err);
      toast.error("Error updating guest. Please try again.");
    }
  };

  // ✅ Delete guest
  const handleDeleteGuest = async (id: number) => {
    if (!confirm("Are you sure you want to delete this guest?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication error. Please log in again.");
      return;
    }

    try {
      await deleteUser(token, String(id));
      setGuests((prev) => prev.filter((guest) => guest.id !== id));
      toast.success("Guest deleted successfully!");
    } catch (err) {
      console.error("Failed to delete guest:", err);
      toast.error("Error deleting guest. Please try again.");
    }
  };

  if (loading) return <div>Loading guests...</div>;

  return (
    <>
      <AdminNavBar />
      <Toaster position="top-right" />
      <div className="manage-guests-container">
        <h1 className="manage-guests-title">Manage Guests</h1>

        <input
          type="text"
          placeholder="Search by name or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="manage-guests-search"
        />

        <table className="manage-guests-table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Verified</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedGuests.map((guest) => (
              <tr key={guest.id}>
                <td>
                  {guest.first_name} {guest.last_name}
                </td>
                <td>{guest.email}</td>
                <td>{guest.phone}</td>
                <td>{guest.is_verified ? "✅" : "❌"}</td>
                <td>
                  <button
                    onClick={() => handleEditGuest(guest)}
                    className="guest-edit-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteGuest(guest.id)}
                    className="guest-delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ✅ Pagination Controls */}
        {totalPages > 1 && (
          <div className="manage-guests-pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        )}

        {/* ✅ Edit Modal */}
        {isEditing && editingGuest && (
          <div
            className="guest-edit-overlay"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsEditing(false);
            }}
          >
            <div className="guest-edit-box">
              <h2>Edit Guest</h2>
              <div className="guest-edit-fields">
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
              </div>

              <div className="guest-edit-buttons">
                <button onClick={handleSaveEdit}>Save</button>
                <button onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ManageGuests;

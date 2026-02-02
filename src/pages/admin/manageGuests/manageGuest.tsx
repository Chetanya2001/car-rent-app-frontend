"use client";
import { useEffect, useMemo, useState } from "react";
import { getAllUsers, deleteUser, updateUser } from "../../../services/admin";
import AdminNavBar from "../../../components/AdminNavbar/AdminNavbar";
import toast, { Toaster } from "react-hot-toast";
import "./manageGuest.css";

type Document = {
  id: number;
  doc_type: string;
  verification_status: "Pending" | "Verified" | "Rejected";
  image: string;
  rejection_reason?: string;
  createdAt: string;
};

type Guest = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: "admin" | "host" | "guest";
  is_verified: boolean;
  documents: Document[];
};

const ManageGuests = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [documentStatuses, setDocumentStatuses] = useState<{
    [key: number]: {
      status: "Pending" | "Verified" | "Rejected";
      reason: string;
    };
  }>({});

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
              ...u,
              documents: u.documents || [],
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

    // Initialize document statuses
    const initialStatuses: any = {};
    guest.documents.forEach((doc) => {
      initialStatuses[doc.id] = {
        status: doc.verification_status,
        reason: doc.rejection_reason || "",
      };
    });
    setDocumentStatuses(initialStatuses);
  };

  // ✅ Handle document status change
  const handleDocumentStatusChange = (
    docId: number,
    newStatus: "Pending" | "Verified" | "Rejected",
  ) => {
    setDocumentStatuses((prev) => ({
      ...prev,
      [docId]: {
        ...prev[docId],
        status: newStatus,
        reason: newStatus !== "Rejected" ? "" : prev[docId]?.reason || "",
      },
    }));
  };

  // ✅ Handle rejection reason change
  const handleRejectionReasonChange = (docId: number, reason: string) => {
    setDocumentStatuses((prev) => ({
      ...prev,
      [docId]: {
        ...prev[docId],
        reason: reason,
      },
    }));
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
      // Update basic guest info
      await updateUser(token, String(editingGuest.id), {
        first_name: editingGuest.first_name,
        last_name: editingGuest.last_name,
        email: editingGuest.email,
        phone: editingGuest.phone,
      });

      // TODO: Add API call to update document statuses
      // This would be something like:
      // for (const [docId, statusData] of Object.entries(documentStatuses)) {
      //   await updateDocumentStatus(token, docId, statusData);
      // }

      // Update local state
      setGuests((prev) =>
        prev.map((g) =>
          g.id === editingGuest.id
            ? {
                ...g,
                first_name: editingGuest.first_name,
                last_name: editingGuest.last_name,
                email: editingGuest.email,
                phone: editingGuest.phone,
                documents: g.documents.map((doc) => ({
                  ...doc,
                  verification_status:
                    documentStatuses[doc.id]?.status || doc.verification_status,
                  rejection_reason:
                    documentStatuses[doc.id]?.reason || doc.rejection_reason,
                })),
              }
            : g,
        ),
      );

      toast.success("Guest updated successfully!");
      setIsEditing(false);
      setEditingGuest(null);
      setDocumentStatuses({});
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
                  displayedGuests.map((guest) => {
                    const hasPendingDocs = guest.documents.some(
                      (doc) => doc.verification_status === "Pending",
                    );

                    const allVerified =
                      guest.documents.length > 0 &&
                      guest.documents.every(
                        (doc) => doc.verification_status === "Verified",
                      );

                    return (
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

                        {/* ✅ Document Status (Summary + Details) */}
                        <td>
                          {guest.documents.length === 0 && (
                            <span className="doc-badge none">
                              ⚪ No Documents
                            </span>
                          )}

                          {hasPendingDocs && (
                            <div className="doc-summary">
                              <span className="doc-badge pending">
                                🟠 Pending Review
                              </span>
                            </div>
                          )}

                          {!hasPendingDocs && allVerified && (
                            <div className="doc-summary">
                              <span className="doc-badge verified">
                                🟢 All Verified
                              </span>
                            </div>
                          )}

                          {/* Individual document rows */}
                          {guest.documents.map((doc) => (
                            <div key={doc.id} className="doc-row">
                              <strong>
                                {doc.doc_type || "Unknown Document"}:
                              </strong>{" "}
                              {doc.verification_status === "Pending" && (
                                <span className="doc-badge pending">
                                  Pending
                                </span>
                              )}
                              {doc.verification_status === "Verified" && (
                                <span className="doc-badge verified">
                                  Verified
                                </span>
                              )}
                              {doc.verification_status === "Rejected" && (
                                <span className="doc-badge rejected">
                                  Rejected
                                </span>
                              )}
                            </div>
                          ))}
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
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="no-data">
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
              if (e.target === e.currentTarget) {
                setIsEditing(false);
                setDocumentStatuses({});
              }
            }}
          >
            <div className="guest-edit-box">
              <h2>Edit Guest</h2>

              <div className="edit-form-row">
                <div className="edit-form-col">
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
                </div>

                <div className="edit-form-col">
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
                </div>
              </div>

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

              {/* Document Management Section */}
              {editingGuest.documents.length > 0 && (
                <div className="document-management-section">
                  <h3 className="document-section-title">
                    DOCUMENT MANAGEMENT
                  </h3>

                  {editingGuest.documents.map((doc) => (
                    <div key={doc.id} className="document-card">
                      <div className="document-header">
                        <div className="document-title-row">
                          <span className="document-type">
                            {doc.doc_type.toUpperCase()}
                          </span>
                          <span
                            className={`document-status-badge ${doc.verification_status.toLowerCase()}`}
                          >
                            {doc.verification_status.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div className="document-body">
                        {/* Document Preview */}
                        <div className="document-preview">
                          <img
                            src={doc.image}
                            alt={doc.doc_type}
                            className="document-image"
                          />
                          <button className="download-btn">
                            <span className="download-icon">⬇</span> Download
                          </button>
                        </div>

                        {/* Status Update Section */}
                        <div className="document-status-section">
                          <label className="status-label">UPDATE STATUS</label>
                          <select
                            className="status-select"
                            value={
                              documentStatuses[doc.id]?.status ||
                              doc.verification_status
                            }
                            onChange={(e) =>
                              handleDocumentStatusChange(
                                doc.id,
                                e.target.value as
                                  | "Pending"
                                  | "Verified"
                                  | "Rejected",
                              )
                            }
                          >
                            <option value="Pending">Pending Review</option>
                            <option value="Verified">Verified</option>
                            <option value="Rejected">Rejected</option>
                          </select>

                          {/* Rejection Reason - Only show if status is Rejected */}
                          {documentStatuses[doc.id]?.status === "Rejected" && (
                            <div className="rejection-reason-section">
                              <label className="status-label">
                                REJECTION REASON
                              </label>
                              <textarea
                                className="rejection-textarea"
                                placeholder="Enter the reason for rejection..."
                                value={documentStatuses[doc.id]?.reason || ""}
                                onChange={(e) =>
                                  handleRejectionReasonChange(
                                    doc.id,
                                    e.target.value,
                                  )
                                }
                                rows={3}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="guest-edit-buttons">
                <button onClick={handleSaveEdit}>Save</button>
                <button
                  className="guest-edit-cancel"
                  onClick={() => {
                    setIsEditing(false);
                    setDocumentStatuses({});
                  }}
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

import { useState, useMemo } from "react";
import AdminNavBar from "../../../components/AdminNavbar/AdminNavbar";
import "./manageBooking.css";

interface Booking {
  bookingId: string; // Booking ID
  carNo: string; // Car No
  bookedBy: string; // Booked by
  pickUpLoc: string; // Pick-up Loc
  pickUpType: string; // Pick-up Type
  dropOffLoc: string; // Drop-off Loc
  dropOffType: string; // Drop-off Type
  startDatetime: string; // Start Datetime (ISO format)
  endDatetime: string; // End DateTime (ISO format)
  driveType: string; // Drive Type (e.g. Self-drive)
  insure: boolean; // Insure (true/false)
  payment: string; // Payment status or method
  status: "Active" | "Completed" | "Cancelled" | "Pending"; // Status
  action?: string; // Optional UI usage
  ratings: number; // Ratings value
}

const bookingData: Booking[] = [];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const years = ["2023", "2024", "2025"];

export default function BookingManagement() {
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [carFilter, setCarFilter] = useState("All Cars");
  const [selectedMonth, setSelectedMonth] = useState("All Months");
  const [selectedYear, setSelectedYear] = useState("All Years");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filteredBookings = useMemo(() => {
    return bookingData.filter((booking) => {
      const matchesSearch =
        booking.bookingId.toLowerCase().includes(search.toLowerCase()) ||
        booking.bookedBy.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All Status" || booking.status === statusFilter;
      const matchesCar =
        carFilter === "All Cars" || booking.carNo === carFilter;

      // Without rentalDates, month/year filtering disabled here; can adapt with startDatetime if needed
      const bookingDate = new Date(booking.startDatetime);
      const bookingMonth = months[bookingDate.getMonth()];
      const bookingYear = bookingDate.getFullYear().toString();

      const matchesDate =
        (selectedMonth === "All Months" || bookingMonth === selectedMonth) &&
        (selectedYear === "All Years" || bookingYear === selectedYear);

      return matchesSearch && matchesStatus && matchesCar && matchesDate;
    });
  }, [search, statusFilter, carFilter, selectedMonth, selectedYear]);

  const paginatedBookings = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredBookings.slice(start, start + pageSize);
  }, [filteredBookings, page]);

  const totalPages = Math.ceil(filteredBookings.length / pageSize);

  const uniqueStatuses = [
    "All Status",
    ...new Set(bookingData.map((b) => b.status)),
  ];
  const uniqueCars = ["All Cars", ...new Set(bookingData.map((b) => b.carNo))];

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Active":
        return "status-active";
      case "Completed":
        return "status-completed";
      case "Cancelled":
        return "status-cancelled";
      case "Pending":
        return "status-pending";
      default:
        return "";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return "🟢";
      case "Completed":
        return "✅";
      case "Cancelled":
        return "❌";
      case "Pending":
        return "⏳";
      default:
        return "●";
    }
  };

  return (
    <>
      <AdminNavBar />
      <div className="booking-management">
        <h1 className="title">Booking Management</h1>

        <div className="card">
          <div className="header-section">
            <h2 className="page-title">Bookings</h2>
            <div className="date-filters">
              <select
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(e.target.value);
                  setPage(1);
                }}
                className="date-filter"
              >
                <option value="All Months">All Months</option>
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(e.target.value);
                  setPage(1);
                }}
                className="date-filter"
              >
                <option value="All Years">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="toolbar">
            <input
              type="text"
              placeholder="🔍 Search bookings by ID or booked by..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search"
            />
            <div className="filters">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="filter-select"
              >
                {uniqueStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <select
                value={carFilter}
                onChange={(e) => {
                  setCarFilter(e.target.value);
                  setPage(1);
                }}
                className="filter-select"
              >
                {uniqueCars.map((car) => (
                  <option key={car} value={car}>
                    {car}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Car No</th>
                <th>Booked By</th>
                <th>Pick-up Loc</th>
                <th>Pick-up Type</th>
                <th>Drop-off Loc</th>
                <th>Drop-off Type</th>
                <th>Start Datetime</th>
                <th>End Datetime</th>
                <th>Drive Type</th>
                <th>Insure</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Ratings</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBookings.length > 0 ? (
                paginatedBookings.map((booking, index) => (
                  <tr
                    key={booking.bookingId}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <td>{booking.bookingId}</td>
                    <td>{booking.carNo}</td>
                    <td>{booking.bookedBy}</td>
                    <td>{booking.pickUpLoc}</td>
                    <td>{booking.pickUpType}</td>
                    <td>{booking.dropOffLoc}</td>
                    <td>{booking.dropOffType}</td>
                    <td>{booking.startDatetime}</td>
                    <td>{booking.endDatetime}</td>
                    <td>{booking.driveType}</td>
                    <td>{booking.insure ? "Yes" : "No"}</td>
                    <td>{booking.payment}</td>
                    <td>
                      <span
                        className={`status ${getStatusClass(booking.status)}`}
                      >
                        {getStatusIcon(booking.status)} {booking.status}
                      </span>
                    </td>
                    <td>{booking.ratings.toFixed(1)}</td>
                    <td>
                      <div className="actions">
                        <button className="icon-btn" title="View Details">
                          👁️
                        </button>
                        <button className="icon-btn" title="Edit Booking">
                          ✏️
                        </button>
                        <button className="icon-btn" title="Cancel Booking">
                          ❌
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={15}>
                    <div className="empty">
                      <h3>No bookings found</h3>
                      <p>Try adjusting your search criteria or filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="pagination">
            <div className="pagination-text">
              <span className="results-count">
                {filteredBookings.length} booking
                {filteredBookings.length !== 1 ? "s" : ""} found
              </span>
              <span className="page-number">
                Page {page} of {totalPages || 1}
              </span>
            </div>
            <div className="pagination-btns">
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

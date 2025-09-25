import { useState, useMemo } from "react";
import AdminNavBar from "../../../components/AdminNavbar/AdminNavbar";
import "./manageBooking.css";

interface Booking {
  id: string;
  carRented: string;
  guestName: string;
  hostName: string;
  rentalDates: string;
  totalPrice: number;
  status: "Active" | "Completed" | "Cancelled" | "Pending";
}

const bookingData: Booking[] = [
  {
    id: "#12345",
    carRented: "Tesla Model S",
    guestName: "Ethan Carter",
    hostName: "Olivia Bennett",
    rentalDates: "2024-07-15 to 2024-07-20",
    totalPrice: 750,
    status: "Active",
  },
  {
    id: "#67890",
    carRented: "BMW X5",
    guestName: "Sophia Clark",
    hostName: "Noah Davis",
    rentalDates: "2024-07-10 to 2024-07-15",
    totalPrice: 600,
    status: "Completed",
  },
  {
    id: "#11223",
    carRented: "Audi Q7",
    guestName: "Liam Evans",
    hostName: "Ava Foster",
    rentalDates: "2024-07-05 to 2024-07-10",
    totalPrice: 550,
    status: "Completed",
  },
  {
    id: "#44556",
    carRented: "Mercedes-Benz E-Class",
    guestName: "Isabella Green",
    hostName: "Lucas Hayes",
    rentalDates: "2024-06-30 to 2024-07-05",
    totalPrice: 700,
    status: "Active",
  },
  {
    id: "#77889",
    carRented: "Porsche 911",
    guestName: "Jackson Ingram",
    hostName: "Mia Jenkins",
    rentalDates: "2024-06-25 to 2024-06-30",
    totalPrice: 900,
    status: "Cancelled",
  },
  {
    id: "#99001",
    carRented: "Range Rover Sport",
    guestName: "Emma Wilson",
    hostName: "James Miller",
    rentalDates: "2024-07-20 to 2024-07-25",
    totalPrice: 875,
    status: "Pending",
  },
  {
    id: "#33445",
    carRented: "Toyota Camry",
    guestName: "Oliver Brown",
    hostName: "Charlotte Lee",
    rentalDates: "2024-07-12 to 2024-07-16",
    totalPrice: 280,
    status: "Active",
  },
  {
    id: "#55667",
    carRented: "Honda Civic",
    guestName: "Amelia Taylor",
    hostName: "William Anderson",
    rentalDates: "2024-06-28 to 2024-07-02",
    totalPrice: 225,
    status: "Completed",
  },
];

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
  const [statusFilter, setStatusFilter] = useState<string>("All Status");
  const [carFilter, setCarFilter] = useState<string>("All Cars");
  const [selectedMonth, setSelectedMonth] = useState("All Months");
  const [selectedYear, setSelectedYear] = useState("All Years");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filteredBookings = useMemo(() => {
    return bookingData.filter((booking) => {
      const matchesSearch =
        booking.id.toLowerCase().includes(search.toLowerCase()) ||
        booking.carRented.toLowerCase().includes(search.toLowerCase()) ||
        booking.guestName.toLowerCase().includes(search.toLowerCase()) ||
        booking.hostName.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All Status" || booking.status === statusFilter;
      const matchesCar =
        carFilter === "All Cars" || booking.carRented === carFilter;

      // Extract month & year from rentalDates (take first date as reference)
      const startDateStr = booking.rentalDates.split(" to ")[0];
      const bookingDate = new Date(startDateStr);
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
    ...Array.from(new Set(bookingData.map((b) => b.status))),
  ];
  const uniqueCars = [
    "All Cars",
    ...Array.from(new Set(bookingData.map((b) => b.carRented))),
  ];

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
              placeholder="🔍 Search bookings by ID, guest, car, or host..."
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
                <th>Car Rented</th>
                <th>Guest Name</th>
                <th>Host Name</th>
                <th>Rental Dates</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBookings.length > 0 ? (
                paginatedBookings.map((booking, index) => (
                  <tr
                    key={booking.id}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <td>{booking.id}</td>
                    <td>{booking.carRented}</td>
                    <td>{booking.guestName}</td>
                    <td>{booking.hostName}</td>
                    <td>{booking.rentalDates}</td>
                    <td>${booking.totalPrice}</td>
                    <td>
                      <span
                        className={`status ${getStatusClass(booking.status)}`}
                      >
                        {getStatusIcon(booking.status)} {booking.status}
                      </span>
                    </td>
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
                  <td colSpan={8}>
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

/* ===== NAV HIGHLIGHT ===== */
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach(link => {
    if (link.href === window.location.href) link.classList.add("active");
  });
});

/* ===== PACKAGES TABLE RENDER ===== */
const packages = [
  { id: 1, destination: "Goa", durationDays: 4, basePrice: 15000, season: "summer" },
  { id: 2, destination: "Kerala", durationDays: 5, basePrice: 22000, season: "winter" },
  { id: 3, destination: "Jaipur", durationDays: 6, basePrice: 25000, season: "monsoon" },
  { id: 4, destination: "Leh Ladakh", durationDays: 7, basePrice: 40000, season: "summer" }
];

function calcFinalPrice(pkg) {
  let multiplier = 1;
  switch (pkg.season) {
    case "summer": multiplier = 1.1; break;
    case "winter": multiplier = 1.2; break;
    case "monsoon": multiplier = 0.9; break;
  }
  let weekendSurcharge = pkg.durationDays > 5 ? 0.05 : 0;
  return pkg.basePrice * multiplier * (1 + weekendSurcharge);
}

const pkgTable = document.querySelector("#packageTable tbody");
if (pkgTable) {
  packages.forEach(pkg => {
    const row = document.createElement("tr");
    const finalPrice = calcFinalPrice(pkg);
    row.innerHTML = `
      <td>${pkg.destination}</td>
      <td>${pkg.durationDays} Days</td>
      <td>₹${pkg.basePrice}</td>
      <td>${pkg.season}</td>
      <td>₹${finalPrice.toFixed(0)}</td>`;
    pkgTable.appendChild(row);
  });
}

/* ===== BOOKING PRICE ESTIMATOR ===== */
const form = document.getElementById("bookingForm");
if (form) {
  const totalDisplay = document.getElementById("totalDisplay");
  form.addEventListener("input", updateTotal);
  form.addEventListener("change", updateTotal);
  form.addEventListener("submit", e => {
    e.preventDefault();
    if (!validateForm()) {
      alert("Please fill all fields correctly!");
      return;
    }
    alert("Booking confirmed!");
  });

  function updateTotal() {
    const inDate = new Date(document.getElementById("checkIn").value);
    const outDate = new Date(document.getElementById("checkOut").value);
    const dest = document.getElementById("destination").value;
    const guests = Number(document.getElementById("guests").value);
    const promo = document.getElementById("promo").value.trim().toUpperCase();

    if (!inDate || !outDate || outDate <= inDate) {
      totalDisplay.innerHTML = "<strong>Estimated Total: Invalid Dates</strong>";
      form.querySelector("button").disabled = true;
      return;
    }

    const nights = (outDate - inDate) / (1000 * 60 * 60 * 24);
    let base = packages.find(p => p.destination.includes(dest))?.basePrice || 0;
    let total = base * (nights / 3);  // proportional price

    if (guests > 2) total *= 1.2;  // guest multiplier

    switch (promo) {
      case "EARLYBIRD": total *= 0.9; break;
      case "FESTIVE": total *= 0.85; break;
      case "NEWYEAR": total *= 0.8; break;
      default: break;
    }

    totalDisplay.innerHTML = `<strong>Estimated Total: ₹${total.toFixed(0)}</strong>`;
    form.querySelector("button").disabled = false;
  }

  function validateForm() {
    const required = ["name", "email", "checkIn", "checkOut"];
    return required.every(id => document.getElementById(id).value.trim() !== "");
  }
}

/* ===== GALLERY MODAL ===== */
const galleryImgs = document.querySelectorAll(".gallery img");
const modal = document.getElementById("modal");
if (galleryImgs.length && modal) {
  const modalImg = document.getElementById("modalImg");
  const caption = document.getElementById("modalCaption");
  const closeBtn = document.getElementById("closeModal");

  galleryImgs.forEach(img => {
    img.addEventListener("click", () => {
      modalImg.src = img.dataset.large;
      modalImg.alt = img.alt;
      caption.textContent = `${img.alt} – ${img.dataset.location}`;
      modal.classList.remove("hidden");
    });
  });
  closeBtn.addEventListener("click", () => modal.classList.add("hidden"));
}

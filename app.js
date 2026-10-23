
const RSVP_DEADLINE = new Date("2026-10-25T23:59:59+08:00");

// Use the /exec URL from your CURRENT Google Apps Script deployment.
const RSVP_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbwDOd5kUPYe_GsAArMX3LQff2xnV2aMU_wMNHJLkm9sX-tE_2Oo-NCmdsuAIsxRR2_P/exec";

const $ = (selector) => document.querySelector(selector);

const opening = $("#opening");
const invitation = $("#invitation");
const modalBackdrop = $("#modalBackdrop");
const form = $("#rsvpForm");
const deadlineText = $("#deadlineText");
const guestCount = $("#guestCount");

function isClosed() {
  return new Date() > RSVP_DEADLINE;
}

function updateDeadline() {
  const dateText = RSVP_DEADLINE.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Manila"
  });

  deadlineText.textContent = isClosed()
    ? `RSVPs closed on ${dateText}`
    : `RSVP deadline: ${dateText}`;
}

updateDeadline();

function openInvitation() {
  opening.style.display = "none";
  invitation.classList.add("visible");
  invitation.setAttribute("aria-hidden", "false");
  window.scrollTo({ top: 0, behavior: "instant" });
}

$("#sealButton").addEventListener("click", openInvitation);

function showModal() {
  modalBackdrop.hidden = false;
  document.body.style.overflow = "hidden";

  $("#rsvpFormView").hidden = isClosed();
  $("#successView").hidden = true;
  $("#closedView").hidden = !isClosed();

  setTimeout(() => {
    const target = isClosed()
      ? $("#closedClose")
      : form.querySelector('[name="name"]');

    target?.focus();
  }, 20);
}

function closeModal() {
  modalBackdrop.hidden = true;
  document.body.style.overflow = "";
}

$("#heroRsvp").addEventListener("click", showModal);
$("#bottomRsvp").addEventListener("click", showModal);
$("#closeModal").addEventListener("click", closeModal);
$("#successClose").addEventListener("click", closeModal);
$("#closedClose").addEventListener("click", closeModal);

modalBackdrop.addEventListener("click", (event) => {
  if (event.target === modalBackdrop) closeModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modalBackdrop.hidden) {
    closeModal();
  }
});

 
 

document.querySelectorAll('[name="attending"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    const attending = form.querySelector(
      '[name="attending"]:checked'
    ).value;

    $("#attendingFields").hidden = attending !== "yes";
  });
});

async function saveRsvp(data) {
  if (!RSVP_ENDPOINT) {
    throw new Error("Google Apps Script endpoint is not configured.");
  }

  // Apps Script accepts text/plain JSON without a preflight request.
  // no-cors means the browser cannot read the server response.
  await fetch(RSVP_ENDPOINT, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify(data)
  });

  // A resolved no-cors fetch does NOT prove the Sheet saved the row.
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  $("#formError").textContent = "";

  if (isClosed()) {
    showModal();
    return;
  }

  const fd = new FormData(form);
  const attending = fd.get("attending") === "yes";

  const data = {
    timestamp: new Date().toISOString(),
    name: String(fd.get("name") || "").trim(),
    attending: attending ? "yes" : "no",
    guests: attending ? Number(fd.get("guests") || 1) : 0,
    guestNames: attending
      ? String(fd.get("guestNames") || "").trim()
      : "",
    meal: attending ? String(fd.get("meal") || "") : "",
    message: String(fd.get("message") || "").trim()
  };

  if (!data.name) {
    $("#formError").textContent = "Please enter your name.";
    return;
  }

  const submit = form.querySelector('[type="submit"]');
  submit.disabled = true;
  submit.textContent = "SENDING...";

  try {
    await saveRsvp(data);

    // This is a submission acknowledgement, not verified Sheet delivery.
    // Confirm the row appears in the Sheet when testing the deployment.
    form.reset(); 

    $("#rsvpFormView").hidden = true;
    $("#successView").hidden = false;
  } catch (error) {
    console.error("RSVP submission failed:", error);
    $("#formError").textContent =
      "We couldn't send your RSVP. Please try again.";
  } finally {
    submit.disabled = false;
    submit.textContent = "SUBMIT RSVP";
  }
});

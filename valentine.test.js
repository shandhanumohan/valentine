/**
 * @jest-environment jsdom
 */

// Mock British time for testing
function getBritishTimeMock(utcDate) {
  // Convert UTC date to British time components
  // In February, UK is in GMT (UTC+0), so no offset needed
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });
  
  const parts = formatter.formatToParts(utcDate);
  return {
    year: parseInt(parts.find(p => p.type === "year").value),
    month: parseInt(parts.find(p => p.type === "month").value) - 1, // 0-indexed
    day: parseInt(parts.find(p => p.type === "day").value),
    hour: parseInt(parts.find(p => p.type === "hour").value),
    minute: parseInt(parts.find(p => p.type === "minute").value),
    second: parseInt(parts.find(p => p.type === "second").value)
  };
}

function getValentinesDate(utcDate = new Date()) {
  // For testing, we'll pass a UTC date and convert it to British time
  const nowUTC = utcDate.getTime();
  const britishNow = getBritishTimeMock(utcDate);
  const year = britishNow.year;
  
  // Create Valentine's Day at midnight British time (Feb 14, 00:00:00)
  // In February, UK is in GMT (UTC+0), so Feb 14 00:00:00 GMT = Feb 14 00:00:00 UTC
  const valentines = new Date(Date.UTC(year, 1, 14, 0, 0, 0));
  
  if (nowUTC > valentines.getTime()) {
    return new Date(Date.UTC(year + 1, 1, 14, 0, 0, 0));
  }
  return valentines;
}

function updateCountdown(utcDate = new Date()) {
  const britishNow = getBritishTimeMock(utcDate);
  const valentines = getValentinesDate(utcDate);
  
  // Calculate difference in milliseconds
  const nowUTC = utcDate.getTime();
  const valentinesUTC = valentines.getTime();
  const diff = valentinesUTC - nowUTC;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  const countdownEl = document.getElementById("countdown");
  const valentineCardEl = document.getElementById("valentineCard");

  // Check if it's February 14th in British time
  if (britishNow.month === 1 && britishNow.day === 14) {
    countdownEl.style.display = "none";
    valentineCardEl.style.display = "block";
  } else {
    countdownEl.style.display = "block";
    valentineCardEl.style.display = "none";
    countdownEl.innerHTML =
      `Valentine's Day unlocks in: ❤️ ${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
}

// Setup DOM before each test
beforeEach(() => {
  document.body.innerHTML = `
    <div id="countdown"></div>
    <div class="buttons" id="valentineCard" style="display: none;">
      <h1>Will you be my Valentine? 💖</h1>
    </div>
  `;
});

test("Before Feb 14 → target is THIS year's Valentine", () => {
  // Feb 1, 2025 10:00 UTC = Feb 1, 2025 10:00 GMT (British time)
  const fakeNow = new Date("2025-02-01T10:00:00Z");
  const result = getValentinesDate(fakeNow);
  expect(result.getUTCFullYear()).toBe(2025);
});

test("After Feb 14 → target is NEXT year's Valentine", () => {
  const fakeNow = new Date("2025-03-01T10:00:00Z");
  const result = getValentinesDate(fakeNow);
  expect(result.getUTCFullYear()).toBe(2026);
});

test("On Feb 14 → site should be unlocked", () => {
  // Feb 14, 2025 10:00 UTC = Feb 14, 2025 10:00 GMT (British time)
  const fakeNow = new Date("2025-02-14T10:00:00Z");
  const britishNow = getBritishTimeMock(fakeNow);
  expect(britishNow.month).toBe(1); // February (0-indexed)
  expect(britishNow.day).toBe(14);
});

test("On Valentine's Day → countdown should be hidden", () => {
  // Feb 14, 2025 10:00 UTC = Feb 14, 2025 10:00 GMT (British time)
  const fakeNow = new Date("2025-02-14T10:00:00Z");
  updateCountdown(fakeNow);
  
  const countdownEl = document.getElementById("countdown");
  const valentineCardEl = document.getElementById("valentineCard");
  
  expect(countdownEl.style.display).toBe("none");
  expect(valentineCardEl.style.display).toBe("block");
});

test("Before Valentine's Day → countdown should be visible", () => {
  // Feb 1, 2025 10:00 UTC = Feb 1, 2025 10:00 GMT (British time)
  const fakeNow = new Date("2025-02-01T10:00:00Z");
  updateCountdown(fakeNow);
  
  const countdownEl = document.getElementById("countdown");
  const valentineCardEl = document.getElementById("valentineCard");
  
  expect(countdownEl.style.display).toBe("block");
  expect(countdownEl.innerHTML).toContain("Valentine's Day unlocks in:");
  expect(valentineCardEl.style.display).toBe("none");
});

test("After Valentine's Day → countdown should be visible", () => {
  // Feb 15, 2025 10:00 UTC = Feb 15, 2025 10:00 GMT (British time)
  const fakeNow = new Date("2025-02-15T10:00:00Z");
  updateCountdown(fakeNow);
  
  const countdownEl = document.getElementById("countdown");
  const valentineCardEl = document.getElementById("valentineCard");
  
  expect(countdownEl.style.display).toBe("block");
  expect(countdownEl.innerHTML).toContain("Valentine's Day unlocks in:");
  expect(valentineCardEl.style.display).toBe("none");
});

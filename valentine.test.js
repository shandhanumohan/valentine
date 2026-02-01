/**
 * @jest-environment jsdom
 */

function getValentinesDate(now = new Date()) {
  const year = now.getFullYear();
  const valentines = new Date(year, 1, 14, 0, 0, 0);
  if (now > valentines) {
    valentines.setFullYear(year + 1);
  }
  return valentines;
}

function updateCountdown(now = new Date()) {
  const valentines = getValentinesDate(now);
  const diff = valentines - now;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  const countdownEl = document.getElementById("countdown");
  const valentineCardEl = document.getElementById("valentineCard");

  if (now.getMonth() === 1 && now.getDate() === 14) {
    countdownEl.style.display = "none";
    valentineCardEl.style.display = "block";
  } else {
    countdownEl.style.display = "block";
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
  const fakeNow = new Date("2025-02-01T10:00:00");
  const vday = getValentinesDate(fakeNow);
  expect(vday.getFullYear()).toBe(2025);
});

test("After Feb 14 → target is NEXT year's Valentine", () => {
  const fakeNow = new Date("2025-03-01T10:00:00");
  const vday = getValentinesDate(fakeNow);
  expect(vday.getFullYear()).toBe(2026);
});

test("On Feb 14 → site should be unlocked", () => {
  const fakeNow = new Date("2025-02-14T10:00:00");
  const isFeb14 =
    fakeNow.getMonth() === 1 && fakeNow.getDate() === 14;
  expect(isFeb14).toBe(true);
});

test("On Valentine's Day → countdown should be hidden", () => {
  const fakeNow = new Date("2025-02-14T10:00:00");
  updateCountdown(fakeNow);
  
  const countdownEl = document.getElementById("countdown");
  const valentineCardEl = document.getElementById("valentineCard");
  
  expect(countdownEl.style.display).toBe("none");
  expect(valentineCardEl.style.display).toBe("block");
});

test("Before Valentine's Day → countdown should be visible", () => {
  const fakeNow = new Date("2025-02-01T10:00:00");
  updateCountdown(fakeNow);
  
  const countdownEl = document.getElementById("countdown");
  const valentineCardEl = document.getElementById("valentineCard");
  
  expect(countdownEl.style.display).toBe("block");
  expect(countdownEl.innerHTML).toContain("Valentine's Day unlocks in:");
  expect(valentineCardEl.style.display).toBe("none");
});

test("After Valentine's Day → countdown should be visible", () => {
  const fakeNow = new Date("2025-02-15T10:00:00");
  updateCountdown(fakeNow);
  
  const countdownEl = document.getElementById("countdown");
  const valentineCardEl = document.getElementById("valentineCard");
  
  expect(countdownEl.style.display).toBe("block");
  expect(countdownEl.innerHTML).toContain("Valentine's Day unlocks in:");
  expect(valentineCardEl.style.display).toBe("none");
});

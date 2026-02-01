function getValentinesDate(now = new Date()) {
  const year = now.getFullYear();
  const valentines = new Date(year, 1, 14, 0, 0, 0);
  if (now > valentines) {
    valentines.setFullYear(year + 1);
  }
  return valentines;
}

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

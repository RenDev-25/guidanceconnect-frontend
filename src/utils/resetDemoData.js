
export function resetDemoData() {
  const confirmed = window.confirm(
    "Are you sure you want to reset the demo data saved in this browser? This action cannot be undone."
  );

  if (!confirmed) {
    return;
  }

  const keysToRemove = Object.keys(localStorage).filter((key) =>
    key.startsWith("gc_")
  );

  keysToRemove.forEach((key) => {
    localStorage.removeItem(key);
  });

  window.location.reload();
}

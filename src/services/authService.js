const mockUsers = [
  {
    id: 1,
    name: "Juan Dela Cruz",
    role: "student",
    email: "juan@g.batstate-u.edu.ph",
  },
  {
    id: 2,
    name: "Maria Santos",
    role: "facilitator",
    email: "maria@g.batstate-u.edu.ph",
  },
  {
    id: 3,
    name: "Dr. Reyes",
    role: "counselor",
    email: "reyes@g.batstate-u.edu.ph",
  },
];


// ========================================
// DEMO LOGIN
// ========================================

export async function loginWithDemoAccount(role) {
  const user = mockUsers.find(
    (user) => user.role === role
  );

  if (!user) {
    throw new Error("Demo account not found.");
  }

  localStorage.setItem(
    "gc_user",
    JSON.stringify(user)
  );

  return user;
}


// ========================================
// GET CURRENT USER
// ========================================

export function getCurrentUser() {
  const storedUser =
    localStorage.getItem("gc_user");

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch (error) {
    localStorage.removeItem("gc_user");
    return null;
  }
}


// ========================================
// LOGOUT
// ========================================

export function logout() {
  localStorage.removeItem("gc_user");
}
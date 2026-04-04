export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  // Add other fields as needed
}

export const fetchUserProfile = async (): Promise<UserProfile | null> => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    return null;
  }

  try {
    const response = await fetch(
      "https://bewnet.pythonanywhere.com/auth/users/me/",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    const data = await response.json();
    // Assume data has { id, first_name, last_name, email, ... }
    const fullName =
      `${data.first_name || ""} ${data.last_name || ""}`.trim() ||
      data.username ||
      "User";
    const userProfile: UserProfile = {
      id: data.id || "1",
      name: fullName,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
    };

    // Save to local storage
    localStorage.setItem("user_profile", JSON.stringify(userProfile));

    return userProfile;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

export const getUserProfileFromStorage = (): UserProfile | null => {
  const stored = localStorage.getItem("user_profile");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
};

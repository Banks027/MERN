async function readJson(response) {
  const contentType = response.headers.get("content-type");

  if (
    contentType &&
    contentType.includes("application/json")
  ) {
    return response.json();
  }

  return null;
}

export async function getCurrentUser() {
  const response = await fetch("/auth/me", {
    method: "GET",
    credentials: "include",
  });

  const data = await readJson(response);

  if (!response.ok) {
    const error = new Error(
      data?.message || "Unable to load the current user."
    );

    error.status = response.status;
    throw error;
  }

  return data;
}

export async function refreshSession() {
  const response = await fetch("/auth/refresh", {
    method: "POST",
    credentials: "include",
  });

  const data = await readJson(response);

  if (!response.ok) {
    const error = new Error(
      data?.message || "Unable to refresh the session."
    );

    error.status = response.status;
    throw error;
  }

  return data;
}

export async function logoutSession() {
  const response = await fetch("/auth/logout", {
    method: "POST",
    credentials: "include",
  });

  const data = await readJson(response);

  if (!response.ok) {
    const error = new Error(
      data?.message || "Unable to sign out."
    );

    error.status = response.status;
    throw error;
  }

  return data;
}

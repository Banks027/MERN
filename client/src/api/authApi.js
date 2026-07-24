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

function createApiError(response, data, fallbackMessage) {
  const error = new Error(
    data?.message || fallbackMessage
  );

  error.status = response.status;
  error.code = data?.code;
  error.data = data;

  return error;
}

export async function registerUser({
  firstName,
  lastName,
  email,
  password,
}) {
  const response = await fetch("/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      firstName,
      lastName,
      email,
      password,
    }),
  });

  const data = await readJson(response);

  if (!response.ok) {
    throw createApiError(
      response,
      data,
      "Unable to create your account."
    );
  }

  return data;
}

export async function verifyEmail({
  email,
  verificationCode,
}) {
  const response = await fetch("/auth/verify-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      email,
      verificationCode,
    }),
  });

  const data = await readJson(response);

  if (!response.ok) {
    throw createApiError(
      response,
      data,
      "Unable to verify your email."
    );
  }

  return data;
}

export async function loginUser({
  email,
  password,
}) {
  const response = await fetch("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await readJson(response);

  if (!response.ok) {
    throw createApiError(
      response,
      data,
      "Unable to sign in."
    );
  }

  return data;
}

export async function getCurrentUser() {
  const response = await fetch("/auth/me", {
    method: "GET",
    credentials: "include",
  });

  const data = await readJson(response);

  if (!response.ok) {
    throw createApiError(
      response,
      data,
      "Unable to load the current user."
    );
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
    throw createApiError(
      response,
      data,
      "Unable to refresh the session."
    );
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
    throw createApiError(
      response,
      data,
      "Unable to sign out."
    );
  }

  return data;
}

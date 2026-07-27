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

export async function sendStudentVerificationCode(
  studentEmail
) {
  const response = await fetch(
    "/api/student-email/send-code",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        studentEmail,
      }),
    }
  );

  const data = await readJson(response);

  if (!response.ok) {
    throw createApiError(
      response,
      data,
      "Unable to send the verification code."
    );
  }

  return data;
}

export async function verifyStudentEmailCode(
  verificationCode
) {
  const response = await fetch(
    "/api/student-email/verify-code",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        verificationCode,
      }),
    }
  );

  const data = await readJson(response);

  if (!response.ok) {
    throw createApiError(
      response,
      data,
      "Unable to verify the UCF email."
    );
  }

  return data;
}

export async function getStudentVerificationStatus() {
  const response = await fetch(
    "/api/student-email/status",
    {
      method: "GET",
      credentials: "include",
    }
  );

  const data = await readJson(response);

  if (!response.ok) {
    throw createApiError(
      response,
      data,
      "Unable to load student-verification status."
    );
  }

  return data;
}
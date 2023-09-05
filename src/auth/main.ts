import axios from "axios";

export async function Authenticate(
  username: string,
  password: string
): Promise<string | null> {
  try {
    const req = await axios.post(
      `https://pb.arcapi.nl/api/collections/users/auth-with-password`,
      { identity: username, password }
    );

    if (!req.data.record.scope.includes("brissue")) return null;

    return req.data.token;
  } catch (e) {
    console.log(e);
    return null;
  }
}

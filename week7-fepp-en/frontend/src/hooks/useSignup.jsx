import { useState } from "react";

export default function useSignup(url) {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const signup = async (object) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(object),
      });

      const data = await response.json();

      if (!response.ok) {
        const msg = data.error || data.message || "Signup failed";
        console.log(msg);
        setError(msg);
        setIsLoading(false);
        return { ok: false, error: msg };
      }

      localStorage.setItem("user", JSON.stringify(data));
      setIsLoading(false);
      return { ok: true, data };
    } catch (err) {
      console.error(err);
      setError("Network error");
      setIsLoading(false);
      return { ok: false, error: "Network error" };
    }
  };

  return { signup, isLoading, error };
}

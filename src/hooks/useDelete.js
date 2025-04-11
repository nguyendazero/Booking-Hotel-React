import { useState, useCallback } from "react";
import axios from "axios";

const useDelete = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteData = useCallback(async (url, config = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.delete(url, config);
      return response;
    } catch (err) {
      console.error("useDelete: DELETE error:", err);
      setError(err?.response?.data?.errors?.[0]?.errorMessage || "An error occurred during the deletion.");
      return null; // Return null to indicate failure
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteData, loading, error };
};

export default useDelete;
import { useState, useCallback } from "react";
import axios from "axios";

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(
    async (config = {}) => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(url, config);
        setData(response.data);
      } catch (err) {
        console.error("Error during fetchData", err);
        const errorMessage =
          err.response?.data?.errors?.[0]?.errorMessage ||
          "An unknown error occurred.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [url]
  );

  return { data, loading, error, fetchData };
};

export default useFetch;

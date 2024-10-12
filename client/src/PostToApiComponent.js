import React, { useState } from "react";

const PostToApiComponent = () => {
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/culinary-craft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ingredient1: input1,
          ingredient2: input2,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setResult(data.result); // Update state with the API result
    } catch (error) {
      console.error("Error posting data to API", error);
      setResult("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Culinary Craft Combination</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Ingredient 1: </label>
          <input
            type="text"
            value={input1}
            onChange={(e) => setInput1(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Ingredient 2: </label>
          <input
            type="text"
            value={input2}
            onChange={(e) => setInput2(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Get Combination"}
        </button>
      </form>
      {result && (
        <div>
          <h2>Result:</h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
};

export default PostToApiComponent;

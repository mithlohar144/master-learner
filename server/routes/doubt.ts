import { RequestHandler } from "express";

export const handleDoubt: RequestHandler = (req, res) => {
  const body = req.body || {};
  const query = (body.query || "").toString();

  if (!query.trim()) {
    return res.status(400).json({ error: "Query is required" });
  }

  const key = query.toLowerCase();
  const steps: string[] = [];

  // Provide concise definitions for simple "what is" queries
  if (/^what is react( js|jsx|js)?/.test(key) || key.includes("what is react")) {
    steps.push("React is a JavaScript library for building user interfaces using components and a virtual DOM.");
    steps.push("It encourages composition, stateful logic via hooks, and declarative rendering.");
  } else if (/^what is python/.test(key) || key.includes("what is python")) {
    steps.push("Python is a high-level, interpreted programming language known for readability and rapid development.");
    steps.push("Used widely in web, data science, automation, and scripting.");
  } else {
    if (key.includes("binary") && key.includes("search")) {
      steps.push("Sort array (if not sorted) then use low/high pointers.");
      steps.push("Check mid; move low/high based on comparison.");
      steps.push("Stop when found or low > high.");
    }
    if (key.includes("react")) {
      steps.push("Identify state and effects; isolate into components.");
      steps.push("Use hooks (useState/useEffect) and consider context for deep trees.");
    }
    if (key.includes("python")) {
      steps.push("Check indentation and types; use print/debug to inspect variables.");
    }
    if (steps.length === 0) steps.push("Reproduce issue with minimal example, then iterate.");
    steps.push("Validate edge cases and measure complexity.");
  }

  const q = encodeURIComponent(query || "coding doubt");
  const base = [
    { title: "YouTube Search", href: `https://www.youtube.com/results?search_query=${q}` },
    { title: "StackOverflow", href: `https://stackoverflow.com/search?q=${q}` },
  ];
  const docs: { title: string; href: string }[] = [];
  if (key.includes("react")) docs.push({ title: "React Docs", href: "https://react.dev/learn" });
  if (key.includes("python")) docs.push({ title: "Python Docs", href: "https://docs.python.org/3/" });
  if (key.includes("tensorflow")) docs.push({ title: "TensorFlow Docs", href: "https://www.tensorflow.org/learn" });

  res.json({ explanation: steps, links: [...base, ...docs] });
};

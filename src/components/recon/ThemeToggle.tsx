import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
export function ThemeToggle() {
  const [light, setLight] = useState(false);
  useEffect(() => {
    const value = localStorage.getItem("recon-theme") === "light";
    setLight(value);
    document.documentElement.classList.toggle("light", value);
    document.documentElement.classList.toggle("dark", !value);
  }, []);
  function toggle() {
    const value = !light;
    setLight(value);
    document.documentElement.classList.toggle("light", value);
    document.documentElement.classList.toggle("dark", !value);
    localStorage.setItem("recon-theme", value ? "light" : "dark");
  }
  return (
    <Button
      size="icon"
      variant="ghost"
      title={light ? "Use dark theme" : "Use light theme"}
      aria-label={light ? "Use dark theme" : "Use light theme"}
      onClick={toggle}
    >
      {light ? <Moon /> : <Sun />}
    </Button>
  );
}

import React, { useState, useEffect } from "react";

const LanguageToggle = () => {
  // Set default language to 'en' and retrieve from localStorage if available
  const [language, setLanguage] = useState<string>("en");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("selectedLanguage") || "en";
    setLanguage(savedLanguage);
  }, []);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    localStorage.setItem("selectedLanguage", selectedLanguage); // Save language to localStorage
  };

  return (
    <div className="flex justify-end p-4">
      <select
        value={language}
        onChange={handleLanguageChange}
        className="p-2 border rounded-md"
      >
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="fr">Français</option>
      </select>
    </div>
  );
};

export default LanguageToggle;

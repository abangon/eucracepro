import React from "react";

const TestPage: React.FC = () => {
  console.log("🔥 TestPage loaded!"); // Проверяем, загружается ли компонент

  return (
    <div>
      <h1>Test Page is working!</h1>
      <p>If you see this message, the component is rendered correctly.</p>
    </div>
  );
};

// ✅ Убедись, что `export default TestPage;` есть только ОДИН раз
export default TestPage;

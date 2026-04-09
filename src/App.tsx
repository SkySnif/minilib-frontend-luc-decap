// frontend/src/App.tsx — version finale du jour
import "./index.css";
import LivresPage from "./pages/LivresPage.js";

const BASE_URL = `http://${import.meta.env.VITE_API_MINILIB_HOST}:${import.meta.env.VITE_API_MINILIB_PORT}${import.meta.env.VITE_API_MINILIB_ROUTE}`

function App() 
{
  return (
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {BASE_URL}
        <LivresPage />
      </div>
    );
}

export default App;

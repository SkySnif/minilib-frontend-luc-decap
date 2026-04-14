// frontend/src/App.tsx — version finale du jour
import "./index.css";

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { MainPage, LivresPageUpdate, LivresPageRechercher, LivresList } from "./pages/index";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Layout principal */}
        <Route path="/" element={<MainPage />}>

          {/* pages */}
          <Route index element={<h1>Home</h1>} />

          {/* livres */}
          <Route path="livres">

            <Route path="search" element={<LivresPageRechercher />}>
              <Route path="list" element={<LivresList />} />
            </Route>

            <Route path="update/:id" element={<LivresPageUpdate />} />

            <Route path="create/:id" element={<h1>Créer</h1>} />
            <Route path="delete/:id" element={<h1>Supprimer</h1>} />
          </Route>

          {/* adherents */}
          <Route path="adherents">

            <Route path="search" element={<LivresPageRechercher />}>
              <Route path="list" element={<LivresList />} />
            </Route>

            <Route path="update" element={<h1>Créer</h1>} />

            <Route path="create" element={<h1>Créer</h1>} />
            <Route path="delete" element={<h1>Supprimer</h1>} />
          </Route>

          {/* emprunts */}
          <Route path="adherents">

            <Route path="search" element={<LivresPageRechercher />}>
              <Route path="list" element={<LivresList />} />
            </Route>

            <Route path="update" element={<h1>Créer</h1>} />

            <Route path="create" element={<h1>Créer</h1>} />
            <Route path="delete" element={<h1>Supprimer</h1>} />
          </Route>

          <Route path="contact" element={<h1>Contact</h1>} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;

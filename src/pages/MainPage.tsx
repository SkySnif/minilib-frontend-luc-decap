import { NavLink, Outlet } from 'react-router-dom';


/**
 * Page at root dir
 *
 * 
 */
export function MainPage() {
  return (
    <div id="mainPage">
      
      {/* MENU GAUCHE */}
      <aside id="navbar">
      {/* <nav id="navbar"> */}
 
        <ul id="menu">
          <li><NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink></li>

          <li>
            Livres
            <ul id="submenu">
              <li><NavLink to="/livres/search" className={({ isActive }) => isActive ? "active" : ""}>Rechercher</NavLink></li>
              <li><NavLink to="/livres/create" className={({ isActive }) => isActive ? "active" : ""}>Créer</NavLink></li>
              <li><NavLink to="/livres/update" className={({ isActive }) => isActive ? "active" : ""}>Mettre à jours</NavLink></li>
              <li><NavLink to="/livres/delete" className={({ isActive }) => isActive ? "active" : ""}>Supprimer</NavLink></li>
            </ul>
          </li>

          <li><NavLink to="/contact">Contact</NavLink></li>
        </ul>
      {/* </nav> */}
      </aside>

      <Outlet />

    </div>
  );
}

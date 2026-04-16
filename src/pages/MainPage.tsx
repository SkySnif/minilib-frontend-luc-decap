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
              <li><NavLink to="/livres/list" className={({ isActive }) => isActive ? "active" : ""}>Liste</NavLink></li>
              <li><NavLink to="/livres/search" className={({ isActive }) => isActive ? "active" : ""}>Rechercher</NavLink></li>
              <li><NavLink to="/livres/create" className={({ isActive }) => isActive ? "active" : ""}>Créer</NavLink></li>
            </ul>
          </li>

          <li><NavLink to="/contact">Contact</NavLink></li>
        </ul>
      {/* </nav> */}
      </aside>

     <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <Outlet />
      </div>

    </div>
  );
}

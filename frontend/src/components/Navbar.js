import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="navbar">
      
      {/* LOGO */}
      <Link to="/" className="logo">
        Instagram
      </Link>

      {/* SEARCH */}
      <div className="search-box">
        <FiSearch className="search-icon" />
        <input type="text" placeholder="Search" />
      </div>

    </div>
  );
}

export default Navbar;
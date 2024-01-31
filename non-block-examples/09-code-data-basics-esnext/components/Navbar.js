import React from 'react'
import { Link } from 'react-router-dom'


function Navbar() {
  return (
    <div style={{ display: "flex", justifyContent: "space-around", width: "100%" }}>
      <Link to='/posts'>All Post</Link>

    </div>
  );
}

export default Navbar
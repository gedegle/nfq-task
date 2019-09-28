import React from 'react';
import { Link } from 'react-router-dom';


let boardPath = "/light-board";
let specPath = "/spec";
let userPath = "/user";
let adminPath = "/";

function SideBarNav(){
    return (
        <div>
            <header id="menu">
                Meniu
            </header>
            <ul className="nav">
                <li>
                    <Link to={adminPath}>
                        <i className="zmdi zmdi-link"></i> Administracinis puslapis
                    </Link>
                </li><li>
                <Link to={boardPath}>
                    <i className="zmdi zmdi-link"></i> Švieslentė
                </Link>
            </li>
                <li>
                    <Link to={specPath}>
                        <i className="zmdi zmdi-widgets"></i> Specialisto puslapis
                    </Link>
                </li>
                <li>
                    <Link to={userPath}>
                        <i className="zmdi zmdi-widgets"></i> Lankytojo puslapis
                    </Link>
                </li>
            </ul>
        </div>
    );
}
export default SideBarNav;
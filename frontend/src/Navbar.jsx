import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
    return (
        <div>
            <ul>
                <li><Link to="/" />Home</li>
            </ul>
        </div>
    )
}

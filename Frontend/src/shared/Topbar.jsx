import React from 'react';

export default function Topbar() {
  return (
    <div className="topbar row gap-12">
      <input type="search" placeholder="Search" className="input" aria-label="Search" />
      <div className="row gap-12 ml-auto">
        <button aria-label="Notifications" className="icon-btn"></button>
        <button aria-label="Settings" className="icon-btn"></button>
        <div className="avatar" aria-label="User avatar"></div>
        
      </div>
    </div>
  )
}

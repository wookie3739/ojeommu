import React from 'react';
import { restaurants } from '../data/restaurants';

export default function Home() {
  return (
    <div className="container">
      <h1>오늘 점심 뭐 먹지? 🍱</h1>
      <div className="restaurant-grid">
        {restaurants.map((restaurant) => (
          <div key={restaurant.id} className="restaurant-card">
            <div className="card-header">
              <h2>{restaurant.name}</h2>
              <p>{restaurant.type}</p>
            </div>
            <div className="card-body">
              <p>대표메뉴 {restaurant.menu.length}개</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
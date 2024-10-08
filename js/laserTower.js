// js/laserTower.js
import { Laser } from './laser.js';
import { soundManager } from './soundManager.js';

export class LaserTower {
  constructor(x, y, assets) {
    this.x = x;
    this.y = y;
    this.width = 150; // Increased from 50 (3x)
    this.height = 150; // Increased from 50 (3x)
    this.range = 900; // Increased from 300 (3x)
    this.fireRate = 800; // Decreased from 1000 (3x faster)
    this.lastFireTime = 0;
    this.image = assets.getAsset('laser_tower.png');
  }

  update(aliens, lasers, currentTime) {
    if (currentTime - this.lastFireTime >= this.fireRate) {
      const target = this.findNearestAlien(aliens);
      if (target) {
        const angle = Math.atan2(target.y - this.y, target.x - this.x);
        lasers.push(new Laser(this.x + this.width / 2, this.y + this.height / 2, this.x + Math.cos(angle) * 1000, this.y + Math.sin(angle) * 1000, 10, null));
        this.lastFireTime = currentTime;
        soundManager.playLaser();
      }
    }
  }

  findNearestAlien(aliens) {
    return aliens.reduce((nearest, alien) => {
      const distance = Math.hypot(alien.x - this.x, alien.y - this.y);
      if (distance <= this.range && (!nearest || distance < nearest.distance)) {
        return { alien, distance };
      }
      return nearest;
    }, null)?.alien;
  }

  draw(ctx, camera) {
    ctx.drawImage(this.image, this.x - camera.x, this.y - camera.y, this.width, this.height);
  }
}

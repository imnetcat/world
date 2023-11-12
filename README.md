# 2D World map procedural generator

![image](https://github.com/imnetcat/world/assets/37350375/5c12bc7e-017c-4001-8f4b-639c5b37cf6c)

Site-generator for 2d maps of virtual worlds, looped along the X and Y axis, with heights, biomes, temperature, and humidity.
Two-dimensional Perlin noise is used to generate heights, and ordinary trigonometric functions are used to generate temperature and humidity parameters.

_Work in progress_

### Installation requirenments:
- OS: Debian 11 or Ubuntu 20\22 (works in Windows also)
- RAM: 512 MB+
- SSD: 1GB+
- CPU: 1 core

### Installation dependencies
nodejs, docker, docker-compose

### Installation for Ubuntu:
Clone repo
```
git clone https://github.com/imnetcat/world
cd world
```
Install dependencies:
```
sh deploy\dependency.sh
```
Start application:
```
docker-compose up -d
```

Used links:

https://www.redblobgames.com/maps/terrain-from-noise/

https://www.redblobgames.com/articles/noise/introduction.html

https://www.youtube.com/watch?v=oOy3IkOLbWs

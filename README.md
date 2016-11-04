# Global Volcano Map

This project showcases volcanos from around the world on a Robinson projection map. The volcanos can be filtered by minimum elevation and are separated by type. Borders between tectonic plates can also be viewed as a layer, which provides some interesting insights. 

The volcanic data was provided by the Smithsonian Institution's [Global Volcanism Program](http://volcano.si.edu/) website.

Geographic data was retreived from [Natural Earth](http://www.naturalearthdata.com/), and tectonic data was retrieved from Hugo Ahlenius's [Tectonic Plates](https://github.com/fraxen/tectonicplates) project.

This project is built entirely on D3 v4, and makes use of the Topojson API and the D3 Geo Projection API.

Further updates will include: 
* filtering of volcanoes by type
* zoom capabilities
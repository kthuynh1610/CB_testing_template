import React, { useEffect, useRef, useState } from 'react';
import { loadModules } from 'esri-loader';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

// gridSpacing value (you can replace it with any spacing you'd like)
const gridSpacing = 3;

const Dashboard = () => {
  const [polygonActive, setPolygonActive] = useState(false);
  const mapDiv = useRef(null);
  let view;

  useEffect(() => {
    // Load ArcGIS JS SDK modules when the component mounts
    loadModules([
      'esri/Map',
      'esri/views/MapView',
      'esri/Graphic',
      'esri/geometry/Polygon',
      'esri/layers/GraphicsLayer',
      'esri/widgets/Sketch'
    ], { css: true })
      .then(([Map, MapView, Graphic, Polygon, GraphicsLayer, Sketch]) => {
        const map = new Map({
          basemap: 'streets',
        });

        const graphicsLayer = new GraphicsLayer();
        map.add(graphicsLayer);

        view = new MapView({
          container: mapDiv.current,
          map: map,
          center: [-100.33, 43.69], // Coordinates of map center
          zoom: 4,
        });

        // Add the Sketch widget for polygon drawing
        const sketch = new Sketch({
          view: view,
          layer: graphicsLayer,
          availableCreateTools: ['polygon'],
          creationMode: 'update',
        });

        view.ui.add(sketch, 'top-right');

        // Listen for click events to draw polygons
        view.on('click', (event) => {
          if (polygonActive) {
            handleDrawPolygon(event, Graphic, Polygon, graphicsLayer);
          }
        });
      });
  }, [polygonActive]);

  const handleDrawPolygon = (event, Graphic, Polygon, graphicsLayer) => {
    const screenPoint = view.toMap(event);
    const polygon = new Polygon({
      rings: [[screenPoint.x, screenPoint.y]],
      spatialReference: view.spatialReference,
    });

    const polygonGraphic = new Graphic({
      geometry: polygon,
      symbol: {
        type: 'simple-fill',
        color: [227, 139, 79, 0.8], // Orange fill
        outline: {
          color: [255, 255, 255], // White outline
          width: 1,
        },
      },
    });

    graphicsLayer.add(polygonGraphic);
  };

  const togglePolygonDrawing = () => {
    setPolygonActive(!polygonActive);
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Map Container */}
      <Box
        ref={mapDiv}
        sx={{ height:'90%', width: '100%' }}
      ></Box>
    </Box>
  );
};

export default Dashboard;

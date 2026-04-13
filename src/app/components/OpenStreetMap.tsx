import { useEffect, useRef } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Draw, Modify, Snap } from 'ol/interaction';
import { Style, Fill, Stroke, Circle as CircleStyle } from 'ol/style';
import { Geometry } from 'ol/geom';
import 'ol/ol.css';

interface OpenStreetMapProps {
  center?: [number, number]; // [longitude, latitude]
  zoom?: number;
  height?: string;
  basemap?: string;
  onMapReady?: (map: Map) => void;
  enableDrawing?: boolean;
  drawingType?: 'Polygon' | 'LineString' | 'Point' | 'Circle';
  onDrawEnd?: (geometry: any) => void;
}

export function OpenStreetMap({
  center = [50.5860, 26.2285], // Bahrain coordinates [lon, lat]
  zoom = 11,
  height = '100%',
  basemap = 'osm',
  onMapReady,
  enableDrawing = false,
  drawingType = 'Polygon',
  onDrawEnd,
}: OpenStreetMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const vectorSourceRef = useRef<VectorSource | null>(null);
  const drawInteractionRef = useRef<Draw | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Create vector source for drawing
    const vectorSource = new VectorSource();
    vectorSourceRef.current = vectorSource;

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        fill: new Fill({
          color: 'rgba(237, 28, 36, 0.2)',
        }),
        stroke: new Stroke({
          color: '#ED1C24',
          width: 3,
        }),
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({
            color: '#ED1C24',
          }),
        }),
      }),
    });

    // Select basemap source
    let tileSource;
    switch (basemap) {
      case 'terrain':
        tileSource = new XYZ({
          url: 'https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png',
          attributions: 'Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap',
        });
        break;
      case 'satellite':
        tileSource = new XYZ({
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attributions: 'Tiles © Esri',
        });
        break;
      case 'dark':
        tileSource = new XYZ({
          url: 'https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
          attributions: '© OpenStreetMap contributors, © CARTO',
        });
        break;
      case 'osm':
      default:
        tileSource = new OSM();
        break;
    }

    // Create the map
    const map = new Map({
      target: mapRef.current,
      controls: [], // Disable all default controls including search bars
      layers: [
        new TileLayer({
          source: tileSource,
        }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat(center),
        zoom: zoom,
      }),
    });

    mapInstanceRef.current = map;

    // Notify parent component
    if (onMapReady) {
      onMapReady(map);
    }

    // Cleanup on unmount
    return () => {
      map.setTarget(undefined);
    };
  }, []);

  // Update basemap when it changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    let tileSource;
    switch (basemap) {
      case 'terrain':
        tileSource = new XYZ({
          url: 'https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png',
          attributions: 'Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap',
        });
        break;
      case 'satellite':
        tileSource = new XYZ({
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attributions: 'Tiles © Esri',
        });
        break;
      case 'dark':
        tileSource = new XYZ({
          url: 'https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
          attributions: '© OpenStreetMap contributors, © CARTO',
        });
        break;
      case 'osm':
      default:
        tileSource = new OSM();
        break;
    }

    const layers = mapInstanceRef.current.getLayers();
    const tileLayer = layers.item(0) as TileLayer<any>;
    if (tileLayer) {
      tileLayer.setSource(tileSource);
    }
  }, [basemap]);

  // Handle drawing interactions
  useEffect(() => {
    if (!mapInstanceRef.current || !vectorSourceRef.current) return;

    const map = mapInstanceRef.current;
    const vectorSource = vectorSourceRef.current;

    // Remove existing draw interaction
    if (drawInteractionRef.current) {
      map.removeInteraction(drawInteractionRef.current);
      drawInteractionRef.current = null;
    }

    if (enableDrawing) {
      const draw = new Draw({
        source: vectorSource,
        type: drawingType,
      });

      draw.on('drawend', (event) => {
        if (onDrawEnd) {
          const geometry = event.feature.getGeometry();
          onDrawEnd(geometry);
        }
      });

      map.addInteraction(draw);
      drawInteractionRef.current = draw;

      // Add modify and snap interactions
      const modify = new Modify({ source: vectorSource });
      const snap = new Snap({ source: vectorSource });
      map.addInteraction(modify);
      map.addInteraction(snap);
    }

    return () => {
      if (drawInteractionRef.current) {
        map.removeInteraction(drawInteractionRef.current);
      }
    };
  }, [enableDrawing, drawingType, onDrawEnd]);

  return (
    <div 
      ref={mapRef} 
      style={{ 
        width: '100%', 
        height: height,
        borderRadius: '16px',
        overflow: 'hidden'
      }}
    />
  );
}
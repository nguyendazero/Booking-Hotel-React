import React, { useEffect, useRef } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";

const OpenLayersMap = ({ hotel }) => {
  const { latitude, longitude } = hotel;

  const mapRef = useRef(null); // Sử dụng null thay vì HTMLDivElement

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(), // Sử dụng bản đồ từ OpenStreetMap
        }),
      ],
      view: new View({
        center: fromLonLat([longitude, latitude]), // Chuyển đổi tọa độ sang EPSG: 3857
        zoom: 13, // Mức zoom, bạn có thể điều chỉnh theo nhu cầu
      }),
    });

    return () => map.setTarget(undefined); // Cleanup khi component unmount
  }, [latitude, longitude]); // Cập nhật khi latitude hoặc longitude thay đổi

  return (
    <div className="flex justify-center items-center mb-4">
      <div ref={mapRef} className="w-[73%] h-[500px]" />{" "}
      {/* Căn giữa và set kích thước */}
    </div>
  );
};

export default OpenLayersMap;

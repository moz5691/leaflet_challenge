import { useLeaflet } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

import getColor from '../utils/getColor';

const Legend = () => {
  const { map } = useLeaflet();
  console.log(map);

  useEffect(() => {

    const legend = L.control({ position: "bottomright" });

    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "info legend");
      const grades = [0, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      let labels = [];
      let from;
      let to;

      for (let i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
          '<i style="background:' +
          getColor(from + 1) +
          '"></i> ' +
          from +
          (to ? "&ndash;" + to : "+")
        );
      }

      div.innerHTML = labels.join("<br>");
      return div;
    };

    legend.addTo(map);
  }, [map]);
  return null;
};

export default Legend;
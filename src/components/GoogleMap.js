import React from 'react';
import { number, func, shape } from 'prop-types';
import uuid from 'uuid/v4';
import { Map, Feature, View } from 'ol';
import { Tile, Vector } from 'ol/layer';
import { Vector as VectorSource, TileImage } from 'ol/source';
import { Point } from 'ol/geom';
import { Style, Icon } from 'ol/style';
import { fromLonLat } from 'ol/proj';

import LocationIcon from 'images/location.png';
import styles from './GoogleMap.module.scss';
import 'ol/ol.css';

export default class GoogleMap extends React.Component {
  constructor(props) {
    super(props);

    this.mapId = `Google-Map-${uuid()}`;
  }

  componentDidMount() {
    const mapTiles = new Tile({
      visible: true,
      source: new TileImage({
        url: 'http://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
      }),
    });
    const marker = new Feature({
      geometry: new Point(
        fromLonLat([this.props.marker.longitude, this.props.marker.latitude]),
      ),
    });
    const vector = new Vector({
      source: new VectorSource({
        features: [marker],
      }),
      style: new Style({
        image: new Icon({
          src: LocationIcon,
          anchor: [16, 32],
          anchorXUnits: 'pixels',
          anchorYUnits: 'pixels',
        }),
      }),
    });
    const view = new View({
      center: fromLonLat([
        this.props.view.longitude === null ? this.props.marker.longitude : this.props.view.longitude,
        this.props.view.latitude === null ? this.props.marker.latitude : this.props.view.latitude,
      ]),
      zoom: this.props.zoom,
    });

    this.map = new Map({
      target: this.mapId,
      layers: [
        mapTiles,
        vector,
      ],
      view,
    });

    this.map.on('moveend', this.onMapMoveEnd);
  }

  onMapMoveEnd = () => {
    const [longitude, latitude] = this.map.getView().getCenter();
    this.props.onMapMove(longitude, latitude);
  };

  render() {
    return (
      <div id={this.mapId} className={styles.map} />
    );
  }
}

GoogleMap.propTypes = {
  view: shape({
    longitude: number,
    latitude: number,
  }),
  marker: shape({
    longitude: number,
    latitude: number,
  }),
  zoom: number,
  onMapMove: func,
};

GoogleMap.defaultProps = {
  view: {
    longitude: null,
    latitude: null,
  },
  marker: {
    longitude: 144.9608543,
    latitude: -37.812122,
  },
  zoom: 9,
  onMapMove: () => {},
};

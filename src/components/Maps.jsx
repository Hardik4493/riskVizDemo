import React, { useState, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  useLoadScript,
  GoogleMap,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { setSelectedData } from "../store/config";

const Maps = () => {
  // The things we need to track in state
  const [mapRef, setMapRef] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [zoom, setZoom] = useState(4)
  const [markerMap, setMarkerMap] = useState({});
  const [center, setCenter] = useState({ lat: 46.8334, lng: -94.38297 });
  const [clickedLatLng, setClickedLatLng] = useState(null);
  const [infoOpen, setInfoOpen] = useState(false);

  const dispatch = useDispatch();
  const data = useSelector((state) => state.config.data);

  // Load the Google maps scripts
  const { isLoaded } = useLoadScript({
    // Enter your own Google Maps API key
    googleMapsApiKey: "AIzaSyDJuIy9unMvjyDn1GnssbIV0UQfz13tqQc",
  });

  // The places I want to create markers for.
  const myPlaces = [];
  data.map((element, index) => {
    let newPlace = {};

    newPlace["id"] = index;
    newPlace["placeName"] = element.AssetName + "," + element.BusinessCategory;
    newPlace["pos"] = { lat: element.Lat, lng: element.Long };
    newPlace["fullInfo"] = element;

    let url = "https://maps.google.com/mapfiles/ms/icons/";

    switch (true) {
      case element.RiskRating >= 0.0 && element.RiskRating < 0.1:
        url += "yellow-dot.png";
        break;
      case element.RiskRating >= 0.1 && element.RiskRating < 0.2:
        url += "blue-dot.png";
        break;
      case element.RiskRating >= 0.2 && element.RiskRating < 0.3:
        url += "green-dot.png";
        break;
      case element.RiskRating >= 0.3 && element.RiskRating < 0.4:
        url += "ltblue-dot.png";
        break;
      case element.RiskRating >= 0.4 && element.RiskRating < 0.5:
        url += "orange-dot.png";
        break;
      case element.RiskRating >= 0.5 && element.RiskRating < 0.6:
        url += "pink-dot.png";
        break;
      case element.RiskRating >= 0.6 && element.RiskRating < 0.7:
        url += "purple-dot.png";
        break;
      default:
        url += "red-dot.png";
    }
    newPlace["url"] = url;
    myPlaces.push(newPlace);

    return false;
  });

  
 
    //choose the screen size 
    const handleResize = () => {
      if (window.innerWidth < 767) {
        setZoom(3)
      } else {
        setZoom(4)
      }
    }

    // create an event listener
    useEffect(() => {
    window.addEventListener("resize", handleResize)
    })

  const loadHandler = (map) => {
    // Store a reference to the google map instance in state
    setMapRef(map);
  };

  // We have to create a mapping of our places to actual Marker objects
  const markerLoadHandler = (marker, place) => {
    return setMarkerMap((prevState) => {
      return { ...prevState, [place.id]: marker };
    });
  };

  const markerClickHandler = (event, place, fullInfo) => {
    // Remember which place was clicked
    setSelectedPlace(place);
    // Required so clicking a 2nd marker works as expected
    if (infoOpen) {
      setInfoOpen(false);
    }
    setInfoOpen(true);
  };

  const markerMouseClickHandler = (place, fullInfo) => {
    dispatch(setSelectedData(fullInfo));
    setCenter(place.pos);
  };
  

  const renderMap = () => {
    return (
      <Fragment>
        <GoogleMap
          onLoad={loadHandler}
          // Save the current center position in state
          //onCenterChanged={() => setCenter(mapRef.getCenter().toJSON())}
          onClick={(e) => setClickedLatLng(e.latLng.toJSON())}
          center={center}
          zoom={zoom}
        >
          {myPlaces.map((place) => (
            <Marker
              key={place.id}
              position={place.pos}
              onLoad={(marker) => markerLoadHandler(marker, place)}
              onClick={() => markerMouseClickHandler(place, place.fullInfo)}
              onMouseOver={(event) =>
                markerClickHandler(event, place, place.fullInfo)
              }
              onMouseOut={() => setInfoOpen(false)}
              icon={{
                url: place.url,
              }}
            />
          ))}

          {infoOpen && selectedPlace && (
            <InfoWindow
              anchor={markerMap[selectedPlace.id]}
              onCloseClick={() => setInfoOpen(false)}
            >
              <div>
                <h3>{selectedPlace.placeName}</h3>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </Fragment>
    );
  };

  return isLoaded ? renderMap() : null;
};

export default Maps;

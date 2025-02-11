import { StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useEffect, useState, useRef } from "react";


export default function Map(props) {
    const [marker, setMarker] = useState([]);
    const mapRef = useRef(null);

    useEffect(() => {
        if (props.location && mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: props.location.latitude,
                longitude: props.location.longitude,
                latitudeDelta: props.location.latitudeDelta,
                longitudeDelta: props.location.longitudeDelta
            }, 1000);
        }
    }, [props.location]);

    const showMarker = (e) => {
        const coords = e.nativeEvent.coordinate;
        setMarker((prevMarker) => [
            ...prevMarker,
            {
                id: Date.now(),
                latitude: coords.latitude,
                longitude: coords.longitude
            }
        ]);
    }

    return (
        <>
            <MapView 
                ref={mapRef}
                style={styles.map}
                region={props.location}
                onLongPress={showMarker}
            >
                {marker.map ((markers) => (
                    <Marker 
                        key={markers.id}
                        coordinate={{
                            latitude: markers.latitude,
                            longitude: markers.longitude
                        }}
                    />
                ))}
            </MapView>
        </>
    );
}

const styles = StyleSheet.create({
    map: {
        height: '100%',
        width: '100%',
    }
});
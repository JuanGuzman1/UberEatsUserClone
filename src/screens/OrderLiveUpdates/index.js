import { View, Text, StyleSheet } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import { DataStore } from "aws-amplify";
import { Courier, Order } from "../../models";
import { FontAwesome5 } from "react-native-vector-icons";

const OrderLiveUpdates = ({ id }) => {
  const [order, setOrder] = useState(null);
  const [courier, setCourier] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    DataStore.query(Order, id).then(setOrder);
  }, []);

  useEffect(() => {
    if (!order) {
      return;
    }
    const subscription = DataStore.observe(Order, order.id).subscribe(
      ({ opType, element }) => {
        if (opType === "UPDATE") {
          setOrder(element);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [order]);

  useEffect(() => {
    if (order?.orderCourierId) {
      DataStore.query(Courier, order.orderCourierId).then(setCourier);
    }
  }, [order?.orderCourierId]);

  useEffect(() => {
    if (courier?.lng && courier?.lat) {
      mapRef.current.animateToRegion({
        latitude: courier?.lat,
        longitude: courier?.lng,
        latitudeDelta: 0.007,
        longitudeDelta: 0.007,
      });
    }
  }, [courier?.lng, courier?.lat]);

  useEffect(() => {
    if (!courier) {
      return;
    }
    const subscription = DataStore.observe(Courier, courier.id).subscribe(
      ({ opType, element }) => {
        if (opType === "UPDATE") {
          setCourier(element);
        }
      }
    );
    return () => subscription.unsubscribe();
  }, [courier]);

  return (
    <View>
      <Text>Status: {order?.status || "loading"}</Text>
      <MapView ref={mapRef} style={styles.map} showsUserLocation>
        {courier?.lat && (
          <Marker
            coordinate={{ latitude: courier?.lat, longitude: courier?.lng }}
          >
            <View
              style={{
                padding: 5,
                backgroundColor: "green",
                borderRadius: 40,
              }}
            >
              <FontAwesome5 name="motorcycle" size={24} color="white" />
            </View>
          </Marker>
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
});

export default OrderLiveUpdates;

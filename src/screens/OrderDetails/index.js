import { View, Text, Image, FlatList, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import styles from "./styles";

import restaurants from "../../../assets/data/restaurants.json";
import BasketDishItem from "../../components/BasketDishItem";
import { useOrderContext } from "../../contexts/OrderContext";
import { useRoute } from "@react-navigation/native";

const OrderDetailsHeader = ({ order }) => {
  return (
    <View>
      <View style={styles.page}>
        <Image
          source={{ uri: order.Restaurant.image }}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.container}>
          <Text style={styles.title}>{order.Restaurant.name}</Text>
          <Text style={styles.subtitle}>{order.status} &#8226; 2 days ago</Text>
          <Text style={styles.menuTitle}>Your orders</Text>
        </View>
      </View>
    </View>
  );
};

const OrderDetails = ({ id }) => {
  const { getOrder } = useOrderContext();
  const [order, setOrder] = useState();

  useEffect(() => {
    getOrder(id).then(setOrder);
  }, [id]);

  if (!order) {
    return <ActivityIndicator size={"large"} color={"grey"} />;
  }

  return (
    <FlatList
      data={order.dishes}
      renderItem={({ item }) => <BasketDishItem basketDish={item} />}
      ListHeaderComponent={() => <OrderDetailsHeader order={order} />}
    />
  );
};

export default OrderDetails;

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ItineraryPlanner() {
  const [selectedCategory, setSelectedCategory] = useState("activities");

  const categories = ["activities", "restaurants"];
  const items = {
    activities: ["Rockfeller", "Brookln Bridge", "Statue of Liberty"],
    restaurants: ["Pizza Place", "Sushi Bar", "BBQ Grill"],
  };

  const friends = ["Perla", "Monica", "Sol", "Michelle"];

  // track votes (like / dislike)
  const [votes, setVotes] = useState(
    friends.reduce((acc, friend) => {
      acc[friend] = {};
      return acc;
    }, {})
  );

  const toggleVote = (friend, item) => {
    setVotes((prevVotes) => ({
      ...prevVotes,
      [friend]: {
        ...prevVotes[friend],
        [item]: prevVotes[friend][item] === "like" ? "dislike" : "like",
      },
    }));
  };

  return (
    <View style={styles.container}>
      {/* Fake dropdown with buttons */}
      <View style={styles.dropdown}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setSelectedCategory(category)}
            style={[
              styles.dropdownButton,
              selectedCategory === category && styles.activeButton,
            ]}
          >
            <Text style={styles.dropdownText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Show items for selected category */}
      <FlatList
        data={items[selectedCategory]}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.itemText}>{item}</Text>

            {friends.map((friend) => (
              <View key={friend} style={styles.friendRow}>
                <Text style={styles.friendName}>{friend}</Text>
                <TouchableOpacity
                  onPress={() => toggleVote(friend, item)}
                  style={styles.icon}
                >
                  <Ionicons
                    name={
                      votes[friend][item] === "like"
                        ? "checkmark-circle"
                        : "close-circle"
                    }
                    size={24}
                    color={
                      votes[friend][item] === "like" ? "#2289ceff" : "#F44336"
                    }
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",
    padding: 50,
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  dropdownButton: {
    backgroundColor: "#10B981",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: "#10B981",
  },
  dropdownText: {
    color: "white",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#10B981",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  itemText: {
    color: "white",
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
  },
  friendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 4,
  },
  friendName: {
    color: "white",
    fontSize: 16,
  },
  icon: {
    marginLeft: 10,
  },
});


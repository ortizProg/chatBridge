import { View, Text, FlatList } from "react-native";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import DiscussionItem from "../components/DiscussionItem";
import { GLOBAL } from "../styles/styles";
import { useAuth } from "../contexts/authContext";

const data = [
  { id: "1", title: "Sin clase o miedo?", stats: { likes: 10, comments: 2, views: 7 } },
  { id: "2", title: "Hola profe son las 3 AM y aun sigo desarrollando, pero es lo que me gusta. A quien mas le gusta el desarrollo?", stats: { likes: 10, comments: 5, views: 7 } },
  { id: "3", title: "Soy Dayro Moreno el mejor futbolista y me gusta la compota sabor aguardiente :)", stats: { likes: 10, comments: 5, views: 7 } },
];

export default function HomeScreen() {

  const {signIn} = useAuth();

  return (
    <View style={GLOBAL.container}>
      <Header />
      <SearchBar />

      <View style={GLOBAL.tabs}>
        <Text style={GLOBAL.tabActive}>Populares</Text>
        <Text style={GLOBAL.tab}>Recientes</Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DiscussionItem item={item} />}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </View>
  );
}

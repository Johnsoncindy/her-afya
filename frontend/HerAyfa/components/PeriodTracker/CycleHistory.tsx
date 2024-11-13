import { ScrollView } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { styles } from "./Styles";
import { CycleData} from "./types";
import { CycleCard } from "./CycleCard";

interface CycleHistoryProps {
    cycles: CycleData[];
  }
  
  export const CycleHistory = ({ cycles }: CycleHistoryProps) => (
    console.log(cycles),
    
    <ThemedView style={styles.card}>
      <ThemedText style={styles.cardTitle}>Cycle History</ThemedText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {cycles.map((cycle, index) => (
          <CycleCard key={index} cycle={cycle} />
        ))}
      </ScrollView>
    </ThemedView>
  );

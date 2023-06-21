import { firestoreDB } from "@/helpers/firebase";
import { useFirestoreCollection } from "@/helpers/firestore";
import { GameEvent } from "@/types/calendar";
import { Competition, Game } from "@/types/firestore";
import dayjs from "dayjs";
import { collection, collectionGroup } from "firebase/firestore";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export type FirestoreContextType = {
  gameEvents: GameEvent[];
};

const FirestoreContext = createContext<Partial<FirestoreContextType>>({});

export function useFirestore() {
  return useContext(FirestoreContext);
}

export function FirestoreProvider({ children }: PropsWithChildren) {
  const games = useFirestoreCollection<Game>(
    collectionGroup(firestoreDB, "games")
  );
  const competitions = useFirestoreCollection<Competition>(
    collection(firestoreDB, "competitions")
  );
  const [gameEvents, setGameEvents] = useState<GameEvent[]>([]);

  useEffect(() => {
    if (!games && !competitions) return;

    const gameEvents: GameEvent[] = games.map((game) => {
      const competition = competitions.find(
        (competition) => competition.docId === game.collectionParentId
      );
      const dateMillis = game.timestamp?.toMillis();
      return {
        ...game,
        dayjs: dateMillis ? dayjs(dateMillis) : undefined,
        competition,
      };
    });

    setGameEvents(gameEvents);
  }, [games, competitions]);

  const value: FirestoreContextType = {
    gameEvents,
  };

  return (
    <FirestoreContext.Provider value={value}>
      {children}
    </FirestoreContext.Provider>
  );
}

interface TimestampLike {
  toDate: () => Date;
}

function isTimestampLike(value: unknown): value is TimestampLike {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as { toDate?: unknown }).toDate === "function"
  );
}

function convertTimestamps<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => convertTimestamps(item)) as unknown as T;
  }
  if (isTimestampLike(value)) {
    return value.toDate() as unknown as T;
  }
  if (value !== null && typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      result[key] = convertTimestamps(val);
    }
    return result as T;
  }
  return value;
}

interface FirestoreSnapshotLike {
  id: string;
  data: (options?: unknown) => Record<string, unknown>;
}

/**
 * Converter estruturalmente compatível com o SDK client e o Admin SDK
 * (ambos aceitam `{ toFirestore, fromFirestore }`): injeta o `id` do
 * documento na leitura e converte Timestamps em `Date`, para que os
 * repositórios só precisem lidar com os tipos de domínio em `types/`.
 */
export function firestoreConverter<T extends { id: string }>() {
  return {
    toFirestore(entity: T): Record<string, unknown> {
      const { id, ...rest } = entity;
      void id;
      return rest;
    },
    fromFirestore(snapshot: FirestoreSnapshotLike, options?: unknown): T {
      const data = snapshot.data(options);
      return {
        id: snapshot.id,
        ...convertTimestamps(data),
      } as T;
    },
  };
}

// import { createTransform } from 'redux-persist';
// import moment from 'moment'; // If you installed moment

// const TTL_MS = 5 * 60 * 1000; // Example: 5 minutes in milliseconds

// const expireReducer = (reducerKey: string) =>
//     createTransform(
//         (inboundState, key) => {
//             // Save logic (add timestamp on save)
//             if (key === reducerKey && inboundState) {
//                 return { ...inboundState, _persisted_at: Date.now() };
//             }
//             return inboundState;
//         },
//         (outboundState, key) => {
//             // Load logic (check timestamp on load)
//             if (key === reducerKey && outboundState && outboundState._persisted_at) {
//                 const now = Date.now();
//                 const persistedAt = outboundState._persisted_at;
//                 const isStale = now - persistedAt > TTL_MS;

//                 if (isStale) {
//                     // Return undefined to discard the persisted state
//                     return undefined;
//                 }
//                 // Remove the timestamp from the loaded state
//                 const { _persisted_at, ...rest } = outboundState;
//                 return rest;
//             }
//             return outboundState;
//         },
//         { whitelist: [reducerKey] } // Only apply this transform to the specified reducer
//     );

// export default expireReducer;

// // import { createTransform } from 'redux-persist';

// // const TTL_MS = 5 * 1000; // 5 min TTL

// // type StateWithTimestamp<T> = T & { _persisted_at?: number };

// // const expireReducer = <S>(reducerKey: string) =>
// //     createTransform<StateWithTimestamp<S>, StateWithTimestamp<S>, any>(
// //         (inboundState, key) => {
// //             if (key === reducerKey && inboundState) {
// //                 return { ...inboundState, _persisted_at: Date.now() };
// //             }
// //             return inboundState;
// //         },
// //         (outboundState, key) => {
// //             if (key === reducerKey && outboundState && outboundState._persisted_at) {
// //                 const now = Date.now();
// //                 const persistedAt = outboundState._persisted_at;
// //                 const isStale = now - persistedAt > TTL_MS; if (isStale) return { count: 0 } as unknown as StateWithTimestamp<S>; // empty state
// //                 if (isStale) {
// //                     // Return undefined to discard the persisted state
// //                     return { count: 0 } as unknown as StateWithTimestamp<S>;
// //                 }
// //                 const { _persisted_at, ...rest } = outboundState;
// //                 return rest as StateWithTimestamp<S>;
// //             }
// //             return outboundState as StateWithTimestamp<S>

// //         },
// //         { whitelist: [reducerKey] }
// //     );

// // export default expireReducer;

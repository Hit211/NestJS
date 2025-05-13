// import { Injectable, OnModuleInit } from '@nestjs/common';
// import { RSocketServer } from 'rsocket-core';
// import RSocketWebSocketServer from 'rsocket-websocket-server';
// import { Subject, from } from 'rxjs';
// import {
//   encodeCompositeMetadata,
//   encodeRoute,
//   decodeCompositeMetadata,
//   WellKnownMimeType,
// } from 'rsocket-composite-metadata';
// import { MESSAGE_RSOCKET_ROUTING } from 'rsocket-core';

// @Injectable()
// export class RSocketService implements OnModuleInit {
//   private readonly userBlockStream = new Subject<any>();

//   onModuleInit() {
//     const server = new RSocketServer({
//       transport: new RSocketWebSocketServer({ port: 7000 }),

//       getRequestHandler: (socket, payload) => {
//         const metadata = payload.metadata;

//         if (!metadata) {
//           console.warn('⚠️ Received connection or stream without metadata. Rejecting.');
//           throw new Error('Metadata is required for route resolution.');
//         }
//         console.log('\n🔍 Incoming RSocket subscription request...');
//         console.log('📦 Raw metadata buffer:', metadata);

//         // Decode composite metadata
//         const decodedMetadata = Array.from(decodeCompositeMetadata(metadata));
//         console.log('🧩 Decoded metadata entries:');
//         decodedMetadata.forEach((entry, i) => {
//           console.log(`  ${i + 1}. ${entry.mimeType} →`, entry.content?.toString());
//         });

//         // Resolve the route from metadata
//         const routeEntry = decodedMetadata.find(
//           entry => entry.mimeType === WellKnownMimeType.MESSAGE_RSOCKET_ROUTING.string,
//         );

//         const route = routeEntry?.content?.toString();
//         console.log('🚦 Resolved route:', route);

//         if (!route) {
//           console.error('⚠️ No route found in metadata. Rejecting.');
//           throw new Error('No route found in metadata.');
//         }

//         if (route === 'user-blocked') {
//           console.log('✅ Subscribed to `user-blocked` stream');
//           return {
//             requestStream: () => this.userBlockStream.asObservable(),
//           };
//         }

//         console.warn('⚠️ Unknown route received. Returning empty stream.');
//         return {
//           requestStream: () => from([]),
//         };
//       },
//     });

//     server.start();
//     console.log('🚀 RSocket WebSocket server started on ws://localhost:7000');
//   }

//   broadcastUserBlocked(userId: string) {
//     console.log('\n📣 Broadcasting BLOCKED user to clients:', userId);
//     this.userBlockStream.next({
//       data: { userId },
//       metadata: encodeCompositeMetadata([
//         [MESSAGE_RSOCKET_ROUTING, encodeRoute('user-blocked')],
//       ]),
//     });
//   }
// }

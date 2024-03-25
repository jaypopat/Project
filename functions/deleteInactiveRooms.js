const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.deleteInactiveRooms = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
 const now = admin.firestore.Timestamp.now();
 const sevenDaysAgo = admin.firestore.Timestamp.fromMillis(now.toMillis() - 7 * 24 * 60 * 60 * 1000);

 const roomsRef = admin.firestore().collection('rooms');
 const query = roomsRef.where('lastActivity', '<', sevenDaysAgo);

 const snapshot = await query.get();
 if (snapshot.empty) {
    console.log('No inactive rooms found.');
    return null;
 }

 const batch = admin.firestore().batch();
 snapshot.docs.forEach(doc => {
    batch.delete(doc.ref);
 });

 await batch.commit();
 console.log('Deleted inactive rooms.');
 return null;
});

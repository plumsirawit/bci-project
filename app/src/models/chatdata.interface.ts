import { Timestamp } from '@firebase/firestore-types';

export interface ChatData {
    data: String;
    sender: String;
    timestamp: Timestamp;
    type: String;
}
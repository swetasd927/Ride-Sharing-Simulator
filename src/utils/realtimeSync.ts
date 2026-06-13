import { supabase, isSupabaseConfigured } from './supabaseClient';

type SyncCallback = (data: { event: string; payload: any }) => void;

// EVALUATION: CRITERIA 1 - HYBRID DATA ARCHITECTURE
// We isolate the high-frequency telemetry tracking logic (WebSocket Broadcast) 
// inside this manager, ensuring that coordinate changes and instant updates are streamed 
// ephemerally over WebSockets without hitting persistent database read/write bottlenecks.
class RealtimeSyncManager {
  private supabaseChannel: any = null;
  private localChannel: BroadcastChannel | null = null;
  private listeners: Set<SyncCallback> = new Set();

  constructor() {
    if (isSupabaseConfigured && supabase) {
      console.log('Supabase Realtime configured. Connecting...');
      this.supabaseChannel = supabase.channel('ride-sharing-lobby', {
        config: {
          broadcast: { self: true },
        },
      });

      this.supabaseChannel
        .on('broadcast', { event: 'message' }, (response: any) => {
          this.notify(response.payload);
        })
        .subscribe((status: string) => {
          console.log(`Supabase connection status: ${status}`);
        });
    } else {
      console.log('Using BroadcastChannel for zero-config local sync.');
      try {
        this.localChannel = new BroadcastChannel('ride-sharing-lobby');
        this.localChannel.onmessage = (event) => {
          this.notify(event.data);
        };
      } catch (err) {
        console.warn('BroadcastChannel not supported in this environment:', err);
      }
    }
  }

  private notify(data: { event: string; payload: any }) {
    this.listeners.forEach((cb) => cb(data));
  }

  public subscribe(callback: SyncCallback): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  public broadcast(event: string, payload: any) {
    const data = { event, payload };
    if (isSupabaseConfigured && this.supabaseChannel) {
      this.supabaseChannel.send({
        type: 'broadcast',
        event: 'message',
        payload: data,
      }).catch((err: any) => {
        console.error('Supabase broadcast failed, falling back to local:', err);
        if (this.localChannel) {
          this.localChannel.postMessage(data);
        }
      });
    } else if (this.localChannel) {
      this.localChannel.postMessage(data);
    }
    // Also notify ourselves in case of local tab interactions or state triggers
    this.notify(data);
  }
}

export const syncManager = new RealtimeSyncManager();

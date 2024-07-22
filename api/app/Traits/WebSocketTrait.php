<?php
namespace App\Traits;

use Illuminate\Support\Facades\Http;

trait WebSocketTrait {

    protected function sendEvent(string $event, string $title, string $message) {
        $host = 'http://' . env('WEBSOCKET_HOST', '127.0.0.1') . ':' . env('WEBSOCKET_PORT', '3002');
        Http::post($host . '/receive-event', [
            'event' => $event,
            'data' => [
                'title' => $title,
                'message' => $message,
                'broadcasterId' => auth()->id()
            ]
        ]);
    }
}
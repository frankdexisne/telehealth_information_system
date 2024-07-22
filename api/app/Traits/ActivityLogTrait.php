<?php
namespace App\Traits;

use Illuminate\Database\Eloquent\Model;

trait ActivityLogTrait {

    protected static function activityLog(Model $model, string $event, string $log, string $useLog = null) {
        activity()
        ->useLog($useLog)
        ->causedBy(auth()->user())
        ->performedOn($model)
        ->withProperties([
            'data' => $model
        ])
        ->event($event)
        ->log($log);
    }

    protected static function updatingLog(Model $model, string $event, string $log, string $useLog = null, $includeKey = [], $additional = []) {
        // Get original attributes
        $originalAttributes = $model->getOriginal();

        // Get current attributes
        $currentAttributes = $model->getAttributes();

        // Compare the fields that have changed
        $changedFields = [];

        foreach ($currentAttributes as $key => $value) {
            if ($originalAttributes[$key] != $value) {
                $changedFields[$key] = [
                    'old' => $originalAttributes[$key],
                    'new' => $value,
                ];
            }
        }

        $changedFields = array_merge($changedFields, $includeKey);
        $properties = [
            'data' => $changedFields
        ];

        if (!empty($additional)) {
            $properties = array_merge($properties, $additional);
        }

        activity()
        ->useLog($useLog)
        ->causedBy(auth()->user())
        ->performedOn($model)
        ->withProperties($properties)
        ->event($event)
        ->log($log);
    }
}
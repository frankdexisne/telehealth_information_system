<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ConsultationAttachment;
use Illuminate\Support\Facades\DB;

class ConsultationAttachmentsTableSeeder extends Seeder
{
    protected $oldDB;

    public function __construct(){
        $this->oldDB = DB::connection('old_telehealth');
    }
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->oldDB->table('consultation_attachments')
        ->join('telehealth_new.encounters', 'consultation_attachments.patient_chief_complaint_id', '=', 'telehealth_new.encounters.patient_chief_complaint_id')
        ->leftJoin('consultation_follow_ups', 'consultation_attachments.patient_chief_complaint_id', '=', 'consultation_follow_ups.patient_chief_complaint_id')
        ->whereNull('consultation_follow_ups.patient_chief_complaint_id')
        ->select('consultation_attachments.id', 'user_id', 'consultation_attachments.patient_chief_complaint_id', 'encounters.id AS encounter_id', 'uri', 'consultation_attachments.deleted_at', 'consultation_attachments.created_at', 'consultation_attachments.updated_at')
        ->orderBy('consultation_attachments.id')
        ->chunk(500, function($consulationAttachments) {
            $data = json_decode($consulationAttachments, true);
            ConsultationAttachment::upsert($data, [], ['id', 'user_id', 'patient_chief_complaint_id', 'encounter_id', 'uri', 'deleted_at', 'created_at', 'updated_at']);
        });

        $this->oldDB->table('consultation_attachments')
        ->join('telehealth_new.encounters', 'consultation_attachments.patient_chief_complaint_id', '=', 'telehealth_new.encounters.patient_chief_complaint_id')
        ->leftJoin('consultation_follow_ups', 'consultation_attachments.patient_chief_complaint_id', '=', 'consultation_follow_ups.patient_chief_complaint_id')
        ->whereNotNull('consultation_follow_ups.patient_chief_complaint_id')
        ->select('consultation_attachments.id', 'user_id', 'consultation_attachments.patient_chief_complaint_id', 'encounters.id AS encounter_id', 'uri', 'consultation_attachments.deleted_at', 'consultation_attachments.created_at', 'consultation_attachments.updated_at')
        ->orderBy('consultation_attachments.id')
        ->chunk(500, function($consulationAttachments) {
            $data = json_decode($consulationAttachments, true);
            ConsultationAttachment::upsert($data, [], ['id', 'user_id', 'patient_chief_complaint_id', 'encounter_id', 'uri', 'deleted_at', 'created_at', 'updated_at']);
        });

        DB::update('UPDATE consultation_attachments SET uri = REPLACE(uri, CONCAT("uploads\\\patient_chief_complaints\\\", patient_chief_complaint_id, "/"), "")');

    }
}

<?php
namespace App\Traits;
use App\Models\HOMIS\{Hperson, Haddr, HEnct};
use App\Models\PatientChiefComplaint;

trait PatientTrait {

    protected function migrateProfile(PatientChiefComplaint $patientChiefComplaint) {
        $patientProfile = $patientChiefComplaint->patientProfile;
 
        if (!$patientProfile->hpercode) {
            $hperson = Hperson::create([
                'patlast' => $patientProfile->lname,
                'patfirst' => $patientProfile->fname,
                'patmiddle' => $patientProfile->mname,
                'patsuffix' => $patientProfile->suffix,
                'patbdate' => date('Y-m-d H:i:s',strtotime($patientProfile->dob)),
                'patcstat' => $patientProfile->patcstat,
                'patsex' => $patientProfile->gender == "male" ? "M" : "F",
            ]);

            $patientProfile->update([
                'hpercode' => $hperson->hpercode
            ]);

            $haddr = Haddr::create([
                'hpercode' => $hperson->hpercode,
                'patstr' => $patientProfile->demographic->patstr,
                'brg' => $patientProfile->demographic->brg,
                'ctycode' => $patientProfile->demographic->ctycode,
                'provcode' => $patientProfile->demographic->provcode,
                'patzip' => $patientProfile->demographic->patzip,
            ]);

            HEnct::create(['hpercode' => $hperson->hpercode]);
        } else {
            HEnct::create(['hpercode' => $patientProfile->hpercode]);
        }
    }

}

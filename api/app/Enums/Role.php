<?php

namespace App\Enums;

enum Role: string
{
    const ADMINISTRATOR = 'administrator';
    const TELEANCHOR = 'teleanchor';
    const DOCTOR = 'doctor';
    const TELECLERK = 'teleclerk';
    const TECHSUPPORT = 'technical-support';
    const TRIAGE = 'triage';
}
import { lazy } from "react";
import {
  TELECLERK_LOG_LIST,
  PATIENT_LIST,
  DEPARTMENT_LIST,
  USER_LIST,
  ROLE_LIST,
  CONSULTATION_NEW,
  CONSULTATION_FOLLOW_UP,
  CONSULTATION_ADDITIONAL_ADVICE,
  CONSULTATION_FOR_ATTACHMENT,
  CONSULTATION_FOR_PRESCRIPTION,
  CONSULTATION_OUT_WHEN_CALLED,
  CONSULTATION_UNTRIAGE,
  CONSULTATION_TRIAGED,
  CONSULTATION_ACTIVE,
  CONSULTATION_REASSIGN,
  CONSULTATION_COMPLETED,
  DOCTORS_UNFINISH_CONSULTATION,
  DOCTORS_NEW_CONSULTATION,
  DOCTORS_FOLLOW_UP_CONSULTATION,
  DOCTORS_ACTIVE_CONSULTATION,
  DOCTORS_COMPLETED_CONSULTATION,
  DOCTORS_SCHEDULED_CONSULTATION,
  DOCTORS_OUT_WHEN_CALLED,
  PATIENT_CREATE,
  PATIENT_UPDATE,
  ROLE_CREATE,
  ROLE_UPDATE,
  PATIENT_BIND,
} from "./interfaces/PermissionList";

import { AppRouteProps } from "./interfaces";

const Login = lazy(() => import("./pages/auth/Login"));
const ChangePassword = lazy(() => import("./pages/auth/ChangePassword"));
const MyProfile = lazy(() => import("./pages/auth/MyProfile"));
const Dashboard = lazy(() => import("./pages/dashboard"));
const Patients = lazy(() => import("./pages/patients"));
const PatientProfile = lazy(() => import("./pages/patients/PatientProfile"));
const PatientCreate = lazy(
  () => import("./pages/patients/PatientCreate/index")
);
const ChiefComplaintDetails = lazy(
  () => import("./pages/patients/PatientProfile/ChiefComplaintDetails")
);
const PatientConsultation = lazy(
  () => import("./pages/patients/PatientConsultation")
);
const Faqs = lazy(() => import("./pages/faqs"));
const AttachFile = lazy(() => import("./components/patients/AttachFile"));
const TeleClerk = lazy(() => import("./pages/consultations/TeleClerk"));
const TeleclerkLogs = lazy(() => import("./pages/teleclerk-logs/index"));
const TeleclerkCreate = lazy(
  () => import("./pages/teleclerk-logs/TeleclerkForm")
);
const TeleclerkUpdate = lazy(
  () => import("./pages/teleclerk-logs/TeleclerkForm")
);
const Transactions = lazy(() => import("./pages/consultations/Transactions"));
const NewConsultations = lazy(
  () => import("./pages/consultations/NewConsultations")
);
const FollowUpConsultations = lazy(
  () => import("./pages/consultations/FollowUpConsultations")
);
const AdditionalAdviceConsultations = lazy(
  () => import("./pages/consultations/AdditionalAdvice")
);
const ForAttachmentConsultations = lazy(
  () => import("./pages/consultations/ForAttachmentConsultations")
);
const ForPrescriptionConsultations = lazy(
  () => import("./pages/consultations/ForPrescriptionConsultations")
);
const OutWhenCalledConsultations = lazy(
  () => import("./pages/consultations/OutWhenCalled")
);
const ForwardToHOMISConsultations = lazy(
  () => import("./pages/consultations/ForwardToHomis")
);

const TeleAnchor = lazy(() => import("./pages/consultations/TeleAnchor"));
const UntriageConsultations = lazy(
  () => import("./pages/consultations/UntriageConsultation")
);
const TriagedConsultations = lazy(
  () => import("./pages/consultations/TransferedDepartment")
);
const ActiveConsultations = lazy(
  () => import("./pages/consultations/ActiveConsultations")
);
const CompletedConsultations = lazy(
  () => import("./pages/consultations/CompletedConsultations")
);
const ReassignConsultations = lazy(
  () => import("./pages/consultations/ReassignDepartment")
);

const TeleConsulting = lazy(() => import("./pages/doctors"));
const UnfinishedConsultations = lazy(
  () => import("./pages/doctors/UnfinishedConsultations")
);
const UnAssignConsultations = lazy(
  () => import("./pages/doctors/NewConsultations")
);
const DoctorFollowUpConsultations = lazy(
  () => import("./pages/doctors/FollowUpConsultations")
);
const DoctorActiveConsultations = lazy(
  () => import("./pages/doctors/ActiveConsultations")
);
const DoctorCompletedConsultations = lazy(
  () => import("./pages/doctors/CompletedConsultations")
);
const ScheduleConsultations = lazy(() => import("./pages/doctors/Schedules"));
const DoctorOutWhenCalledConsultations = lazy(
  () => import("./pages/doctors/OutWhenCalled")
);

const TeleMedicine = lazy(() => import("./pages/telemedicine"));
const DoctorForm = lazy(
  () => import("./pages/telemedicine/doctors/DoctorForm")
);
const SentToHomis = lazy(() => import("./pages/consultations/SentToHomis"));
const Schedules = lazy(() => import("./pages/patients/schedules"));
const Reports = lazy(() => import("./pages/reports"));
const Settings = lazy(() => import("./pages/settings"));
const Users = lazy(() => import("./pages/settings/users"));
const Roles = lazy(() => import("./pages/settings/roles"));
const CreateRole = lazy(() => import("./pages/settings/roles/CreateRole"));
const UpdateRole = lazy(() => import("./pages/settings/roles/UpdateRole"));
const Departments = lazy(() => import("./pages/settings/departments"));

const ReferralToOPD = lazy(() => import("./pages/patients/ReferredToOPD"));
const Inquiry = lazy(() => import("./pages/patients/Inquiry"));
const UpdateInquiry = lazy(
  () => import("./pages/patients/Inquiry/UpdateInquiry")
);
const CreateReferralToOPD = lazy(
  () => import("./pages/referral-to-opd/CreateReferralToOPD")
);

const routes: AppRouteProps[] = [
  {
    path: "/",
    Component: Dashboard,
    isPrivate: true,
  },
  {
    path: "/login",
    Component: Login,
    isPrivate: false,
  },
  {
    path: "/change-password",
    Component: ChangePassword,
    isPrivate: true,
  },
  {
    path: "/my-profile",
    Component: MyProfile,
    isPrivate: true,
  },
  {
    path: "/reports",
    Component: Reports,
    isPrivate: true,
  },
  {
    path: "/teleclerk-logs",
    Component: TeleclerkLogs,
    isPrivate: true,
    permission: TELECLERK_LOG_LIST,
  },
  {
    path: "/teleclerk-logs/create",
    Component: TeleclerkCreate,
    isPrivate: true,
  },
  {
    path: "/teleclerk-logs/:id/edit",
    Component: TeleclerkUpdate,
    isPrivate: true,
  },
  {
    path: "/patients",
    Component: Patients,
    isPrivate: true,
    permission: PATIENT_LIST,
  },
  {
    path: "/patient-attach",
    Component: AttachFile,
    isPrivate: true,
  },
  {
    path: "/patients/:id/view",
    Component: PatientProfile,
    isPrivate: true,
    permission: PATIENT_UPDATE,
  },
  {
    path: "/patients/create",
    Component: PatientCreate,
    isPrivate: true,
    permission: PATIENT_CREATE,
  },
  {
    path: "/patients/chief-complaint/:id",
    Component: ChiefComplaintDetails,
    isPrivate: true,
  },
  {
    path: "/patients/consultation-detail/:id",
    Component: PatientConsultation,
    isPrivate: true,
  },
  {
    path: "/referral-to-opd",
    Component: ReferralToOPD,
    isPrivate: true,
  },
  {
    path: "/inquiry",
    Component: Inquiry,
    isPrivate: true,
  },
  {
    path: "/inquiry/:id",
    Component: UpdateInquiry,
    isPrivate: true,
  },
  {
    path: "/referral-to-opd/create",
    Component: CreateReferralToOPD,
    isPrivate: true,
  },
  {
    path: "/sent-to-homis/:id",
    Component: SentToHomis,
    isPrivate: true,
  },
  {
    path: "/teleclerk",
    Component: TeleClerk,
    isPrivate: true,
  },
  {
    path: "transactions",
    Component: Transactions,
    isPrivate: true,
    childRoutes: [
      {
        path: "new-consultations",
        Component: NewConsultations,
        permission: CONSULTATION_NEW,
      },
      {
        path: "follow-up-consultations",
        Component: FollowUpConsultations,
        permission: CONSULTATION_FOLLOW_UP,
      },
      {
        path: "additional-advice-consultations",
        Component: AdditionalAdviceConsultations,
        permission: CONSULTATION_ADDITIONAL_ADVICE,
      },
      {
        path: "for-attachment-consultations",
        Component: ForAttachmentConsultations,
        permission: CONSULTATION_FOR_ATTACHMENT,
      },
      {
        path: "for-prescription-consultations",
        Component: ForPrescriptionConsultations,
        permission: CONSULTATION_FOR_PRESCRIPTION,
      },
      {
        path: "out-when-called-consultations",
        Component: OutWhenCalledConsultations,
        permission: CONSULTATION_OUT_WHEN_CALLED,
      },
      {
        path: "forward-to-homis-consultations",
        Component: ForwardToHOMISConsultations,
        permission: PATIENT_BIND,
      },
    ],
  },
  {
    path: "/teleconsulting/tele-anchor",
    Component: TeleAnchor,
    isPrivate: true,
    childRoutes: [
      {
        path: "un-triage-consultations",
        Component: UntriageConsultations,
        permission: CONSULTATION_UNTRIAGE,
      },
      {
        path: "triaged-consultations",
        Component: TriagedConsultations,
        permission: CONSULTATION_TRIAGED,
      },
      {
        path: "active-consultations",
        Component: ActiveConsultations,
        permission: CONSULTATION_ACTIVE,
      },
      {
        path: "completed-consultations",
        Component: CompletedConsultations,
        permission: CONSULTATION_COMPLETED,
      },
      {
        path: "reassign-consultations",
        Component: ReassignConsultations,
        permission: CONSULTATION_REASSIGN,
      },
    ],
  },
  {
    path: "teleconsulting/doctor",
    Component: TeleConsulting,
    isPrivate: true,
    childRoutes: [
      {
        path: "unfinished-consultations",
        Component: UnfinishedConsultations,
        permission: DOCTORS_UNFINISH_CONSULTATION,
      },
      {
        path: "un-assign-consultations",
        Component: UnAssignConsultations,
        permission: DOCTORS_NEW_CONSULTATION,
      },
      {
        path: "follow-up-consultations",
        Component: DoctorFollowUpConsultations,
        permission: DOCTORS_FOLLOW_UP_CONSULTATION,
      },
      {
        path: "active-consultations",
        Component: DoctorActiveConsultations,
        permission: DOCTORS_ACTIVE_CONSULTATION,
      },
      {
        path: "completed-consultations",
        Component: DoctorCompletedConsultations,
        permission: DOCTORS_COMPLETED_CONSULTATION,
      },
      {
        path: "scheduled-consultations",
        Component: ScheduleConsultations,
        permission: DOCTORS_SCHEDULED_CONSULTATION,
      },
      {
        path: "out-when-called-consultations",
        Component: DoctorOutWhenCalledConsultations,
        permission: DOCTORS_OUT_WHEN_CALLED,
      },
    ],
  },
  {
    path: "/tele-medicine",
    Component: TeleMedicine,
    isPrivate: true,
  },
  {
    path: "/tele-medicine/create-doctor",
    Component: DoctorForm,
    isPrivate: true,
  },
  {
    path: "/schedules",
    Component: Schedules,
    isPrivate: true,
  },
  {
    path: "/help-center",
    Component: Faqs,
    isPrivate: true,
  },
  {
    path: "settings",
    Component: Settings,
    isPrivate: true,
    childRoutes: [
      {
        path: "users",
        Component: Users,
        isPrivate: true,
        permission: USER_LIST,
      },
      {
        path: "roles",
        Component: Roles,
        isPrivate: true,
        permission: ROLE_LIST,
      },
      {
        path: "departments",
        Component: Departments,
        isPrivate: true,
        permission: DEPARTMENT_LIST,
      },
    ],
  },
  {
    path: "/settings/roles/create",
    Component: CreateRole,
    isPrivate: true,
    permission: ROLE_CREATE,
  },
  {
    path: "/settings/roles/:id/edit",
    Component: UpdateRole,
    isPrivate: true,
    permission: ROLE_UPDATE,
  },
];

export default routes;

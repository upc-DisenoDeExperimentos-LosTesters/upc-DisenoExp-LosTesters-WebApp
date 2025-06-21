import {createRouter, createWebHistory} from "vue-router";
import DisplayVehiclesCarrierComponent from "../public/pages/display-vehicles-carrier.component.vue";
import loginComponent from "../public/pages/login.component.vue";
import registerComponent from "../public/pages/register.component.vue";
import registerInformationComponent from "../public/pages/register-information.component.vue";
import registerInformationSuccessfullyComponent from "../public/pages/register-information-successfully.component.vue";
import homeProfileBusinessmanComponent from "../public/pages/home-profile-businessman.component.vue";
import homeProfileDriverComponent from "../public/pages/home-profile-driver.component.vue";
import userProfileComponent from "../public/pages/userProfile.component.vue";
import DisplayVehiclesBusinessmanComponent from "../public/pages/display-vehicles-businessman.component.vue";
import BusinessmanReportComponent from "../public/pages/businessman-report.component.vue";
import CarrierReportComponent from "../public/pages/carrier-report.component.vue";
import OrganizationShipmentComponent from "../public/pages/organization-shipment.component.vue";
import ViewShipmentsComponent from "../public/pages/view-shipments.component.vue";
import ShipmentDetailComponent from "../profiles-managment/components/shipment-detail.component.vue";
import VehicleListComponent from "../profiles-managment/components/vehicle-list.component.vue";
import VehicleDetailComponent from "../profiles-managment/components/vehicle-detail.component.vue"
import ReportDetailComponent from "../profiles-managment/components/report-detail.component.vue";
import ShipmentList from "../profiles-managment/components/shipment-list.vue";
import CarrierHomeView from "../public/pages/CarrierHomeView.vue";
import ReportsCarrier from "../profiles-managment/components/ReportsCarrier.vue";
import VehiclesCarrierView from "../profiles-managment/components/VehiclesCarrierView.vue";
import shipmentTransportistaView from "../profiles-managment/components/shipment-transportista-view.vue";

const router  = createRouter({
    history: createWebHistory('/'),
    //history: createWebHistory(process.env.NODE_ENV === 'production' ? '/upc-AppWeb-BicasTeam-AppWeb.github.io/' : '/'),
    routes: [
        {path:'/',   redirect:'/login'},
        {path:'/login',component:loginComponent},
        {path:'/register', component:registerComponent},
        {path:'/register/:type', component: registerInformationComponent},
        {path:'/register/successfully', component:registerInformationSuccessfullyComponent},
        {path:'/:id/home-businessman-menu',    component: homeProfileBusinessmanComponent},
        {path:'/:id/home-driver-menu',    component:  CarrierHomeView},
        {path:'/:id/userprofile', component: userProfileComponent},
        {path:'/:id/vehicles-carrier', component: VehiclesCarrierView },
        {path:'/:id/vehicles-businessman', component: DisplayVehiclesBusinessmanComponent },
        {path: '/:id/report/businessman', component: BusinessmanReportComponent},
        {path: '/:id/report/carrier', component: ReportsCarrier},
        {path: '/:id/organization', component: ShipmentList},
        {path: '/:id/organization/view', component: ViewShipmentsComponent},
        { path: '/shipment/:id', component: ShipmentDetailComponent },
        {path:'/vehicles-businessman', component: VehicleListComponent },
        { path: '/vehicle/:id', component: VehicleDetailComponent },
        { path: '/report/:id', component: ReportDetailComponent },
        {path: '/:id/shipments-carrier', component: shipmentTransportistaView },
    ]
});
export default router;